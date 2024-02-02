const Conversation = require("../models/conversation");
const Chat = require("../models/chat");

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
            console.error(error);
            throw new Error("Error while fetching chat conversation");
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
            console.error(error);
            throw new Error("Error while creating new conversation");
        }
    };

    async saveNewChatMessage(chatMessage) {
        try {
            const newChatMessage = new Chat({ ...chatMessage });
            await newChatMessage.save();
        } catch (error) {
            console.error(error);
            throw new Error("Error while saving new chat message");
        }
    };

    async findChatHistory(conversationId) {
        try {
            return await Chat.find({ conversationId }).populate("conversationId");
        } catch (error) {
            console.error(error);
            throw new Error("Error while fetching chat history");
        }
    };
};

module.exports = new ChatRepository();
