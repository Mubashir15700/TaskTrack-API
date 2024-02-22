const Conversation = require("../models/conversation");
const Chat = require("../models/chat");
const repositoryErrorHandler = require("../utils/errorHandling/repositoryErrorHandler");

class ChatRepository {
    async findConversation(senderId, receiverId) {
        try {
            return await Conversation.findOne({
                $or: [
                    { senderId: senderId, receiverId: receiverId },
                    { senderId: receiverId, receiverId: senderId },
                ],
            });
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };

    async createConversation(senderId, receiverId) {
        try {
            const newConversation = new Conversation({
                senderId,
                receiverId,
            });
            return await newConversation.save();
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };

    async saveNewChatMessage(chatMessage) {
        try {
            const newChatMessage = new Chat({ ...chatMessage });
            await newChatMessage.save();
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };

    async findChatHistory(conversationId) {
        try {
            return await Chat.find({ conversationId }).populate("conversationId");
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };

    async updateMessagesReadStatus(messageIds) {
        try {
            await Chat.updateMany(
                { _id: { $in: messageIds } },
                { $set: { isRead: true } }
            );
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };
};

module.exports = new ChatRepository();
