const socket = require("socket.io");
const crypto = require("crypto");

// 1. Fixed the parameter typo: useruserId -> userId
const getSecretRoomId = (userId, targetUserId) => {
    return crypto.createHash('sha256')
        .update([userId, targetUserId].sort().join("_"))
        .digest('hex');
}

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: { origin: "http://localhost:5173" }
    });

    io.on("connection", (socket) => {
        // Log connection for your DevTinder troubleshooting
        console.log("Client connected: ", socket.id);

        socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
            const roomId = getSecretRoomId(userId, targetUserId);
            socket.join(roomId);
            // Added space for cleaner logs
            console.log(`User ${firstName} joined room: ${roomId}`);
        });

        socket.on("sendMessage", ({ firstName, userId, targetUserId, message }) => {
            try {
                const roomId = getSecretRoomId(userId, targetUserId);
                
                // Emit to the hashed room
                io.to(roomId).emit("messageReceived", {
                    firstName,
                    userId, // Crucial for chat-start vs chat-end logic
                    message,
                });
                
                console.log(`[${roomId}] ${firstName}: ${message}`);
            } catch (err) {
                console.error("Socket error:", err.message);
            }
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });
    });
};

module.exports = initializeSocket;