const socket = require("socket.io");
const crypto = require("crypto");


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
       
        console.log("Client connected: ", socket.id);

        socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
            const roomId = getSecretRoomId(userId, targetUserId);
            socket.join(roomId);
           
            console.log(`User ${firstName} joined room: ${roomId}`);
        });

        socket.on("sendMessage", ({ firstName, userId, targetUserId, message }) => {
            try {
                const roomId = getSecretRoomId(userId, targetUserId);
                
               
                io.to(roomId).emit("messageReceived", {
                    firstName,
                    userId, 
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