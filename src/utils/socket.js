const socket = require("socket.io");
const crypto = require("crypto");
const { get } = require("http");
const Chat = require("../models/chat");
const ConnectionRequest = require("../models/connectionRequest");


const getSecretRoomId = (userId, targetUserId) => {

    const id1 = typeof userId === 'object' ? (userId._id?.toString() || userId.toString()) : userId.toString();
    const id2 = typeof targetUserId === 'object' ? (targetUserId._id?.toString() || targetUserId.toString()) : targetUserId.toString();


    const sortedIds = [id1, id2].sort();

    return crypto.createHash('sha256')
        .update(sortedIds.join("_"))
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

        socket.on("sendMessage", async ({ firstName, userId, targetUserId, message }) => {
            try {
                const roomId = getSecretRoomId(userId, targetUserId);

                const connectionRequest = await ConnectionRequest.findOne({
                    $or: [
                        { fromUserId: userId, toUserId: targetUserId, status: "accepted" },
                        { fromUserId: targetUserId, toUserId: userId, status: "accepted" }
                    ]
                });

                if (!connectionRequest) {
                    // If they aren't connected in DB, stop the message
                    return console.error("Users are not connected. Message blocked.");
                }
                let chat = await Chat.findOne({
                    participants: { $all: [userId, targetUserId] }
                });

                if (!chat) {
                    chat = new Chat({
                        participants: [userId, targetUserId],
                        messages: [],
                    });
                }

                chat.messages.push({
                    senderId: userId,
                    text: message,
                });

                await chat.save();

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