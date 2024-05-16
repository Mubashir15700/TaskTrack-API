const mongoose = require("mongoose");
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

    async findPreviousConversations(userId) {
        return await Conversation.aggregate([
            {
                $match: {
                    $or: [
                        { senderId: new mongoose.Types.ObjectId(userId) },
                        { receiverId: new mongoose.Types.ObjectId(userId) }
                    ]
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "senderId",
                    foreignField: "_id",
                    as: "sender"
                }
            },
            {
                $unwind: "$sender"
            },
            {
                $lookup: {
                    from: "users",
                    localField: "receiverId",
                    foreignField: "_id",
                    as: "receiver"
                }
            },
            {
                $unwind: "$receiver"
            },
            {
                $project: {
                    otherUser: {
                        $cond: [
                            { $eq: ["$sender._id", new mongoose.Types.ObjectId(userId)] },
                            "$receiver",
                            "$sender"
                        ]
                    }
                }
            },
            {
                $project: {
                    otherUser: {
                        _id: 1,
                        username: 1
                    }
                }
            }
        ]);
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
