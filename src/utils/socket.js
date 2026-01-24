const socket = require("socket.io");

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: { origin: "http://localhost:5173" }
    });

    io.on("connection", (socket) => {


        socket.on("joinChat", (
            { firstName, userId, targetUserId }
        ) => {
            const roomId = [userId, targetUserId].sort().join("_");
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