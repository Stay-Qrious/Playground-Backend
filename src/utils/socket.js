const socket = require("socket.io");
const crypto = require("crypto");

const getSecretRoomId = (useruserId, targetUserId) => {
    return crypto.createHash('sha256')
        .update([useruserId, targetUserId].sort().join("_"))
        .digest('hex');
}

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: { origin: "http://localhost:5173" }
    });

    io.on("connection", (socket) => {


        socket.on("joinChat", (
            { firstName, userId, targetUserId }
        ) => {
            const roomId = getSecretRoomId(userId, targetUserId);
            socket.join(roomId);
            console.log(`User ${firstName} joined room${roomId}`);


        });
        socket.on("sendMessage", (
            {

                firstName,
                userId,
                targetUserId,
                message,
            }



        ) => {
            const roomId = [userId, targetUserId].sort().join("_");
            io.to(roomId).emit("messageReceived", {
                firstName,
                userId,
                message,
            });
            console.log("Received message: ", message);
        });
        socket.on("disconnect", () => { });
    });


};

module.exports = initializeSocket;