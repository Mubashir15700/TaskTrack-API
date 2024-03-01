const Conversation = require("../models/conversation");

class ConversationRepository {
    async findConversation(senderId, receiverId) {
        return await Conversation.findOne({
            $or: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId },
            ],
        });
    };

    async createConversation(senderId, receiverId) {
        const newConversation = new Conversation({
            senderId,
            receiverId,
        });
        return await newConversation.save();
    };
};

module.exports = ConversationRepository;
