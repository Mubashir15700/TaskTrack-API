const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
});

const conversation = mongoose.model("conversation", conversationSchema);

module.exports = conversation;
