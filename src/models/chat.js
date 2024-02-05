const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const Chat = mongoose.model("Chat", ChatSchema);

module.exports = Chat;
