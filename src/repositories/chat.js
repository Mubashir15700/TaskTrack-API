const Chat = require("../models/chat");

class ChatRepository {
    async saveNewChatMessage(chatMessage) {
        const newChatMessage = new Chat({ ...chatMessage });
        await newChatMessage.save();
    };

    async findChatHistory(conversationId) {
        return await Chat.find({ conversationId }).populate("conversationId");
    };

    async updateMessagesReadStatus(messageIds) {
        return await Chat.updateMany(
            { _id: { $in: messageIds } },
            { $set: { isRead: true } }
        );
    };
};

module.exports = ChatRepository;
