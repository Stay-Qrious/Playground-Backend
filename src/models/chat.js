const { Schema, model } = require('mongoose');



const messagesSchema = new Schema({
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
}, { timestamps: true });

const chatSchema = new Schema({
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    messages: [messagesSchema]
}, { timestamps: true });

module.exports = model('Chat', chatSchema);

