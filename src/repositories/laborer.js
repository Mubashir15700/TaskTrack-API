const mongoose = require("mongoose");
const User = require("../models/user");
const Laborer = require("../models/laborer");

class LaborerRepository {
    async searchLaborers(currentUserId, searchWith) {
        const pipeline = [
            currentUserId !== undefined && {
                $match: { userId: { $ne: new mongoose.Types.ObjectId(currentUserId) } }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $match: {
                    $or: [
                        { "user.username": { $regex: searchWith, $options: "i" } },
                        { "user.email": { $regex: searchWith, $options: "i" } }
                    ]
                }
            },
            {
                $project: {
                    "_id": 1,
                    "user.location": 1,
                    "user._id": 1,
                    "user.username": 1,
                    "user.profile": 1,
                    "fields": 1,
                    "__v": 1
                }
            },
        ].filter(Boolean);

        return await Laborer.aggregate(pipeline);
    };

    async saveLaborerDetails(data) {
        const newLaborer = new Laborer(data);
        return await newLaborer.save();
    };

    async getLaborersCount(userId) {
        const query = userId !== "undefined" ?
            { userId: { $ne: userId } } : {};
        return await Laborer.countDocuments(query);
    };

    async getLaborers(userId, searchWith, page = null, pageSize = null) {
        const pipeline = [];

        if (userId !== "undefined" && userId !== undefined) {
            pipeline.push({
                $match: { userId: { $ne: new mongoose.Types.ObjectId(userId) } }
            });
        }

        pipeline.push(
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $project: {
                    "_id": 1,
                    "user.location": 1,
                    "user._id": 1,
                    "user.username": 1,
                    "user.email": 1,
                    "user.profile": 1,
                    "fields": 1,
                    "__v": 1
                }
            },
        );

        if (page && pageSize) {
            pipeline.push(
                {
                    $skip: (page - 1) * pageSize
                },
                {
                    $limit: pageSize
                }
            );
        }

        if (searchWith) {
            pipeline.push(
                {
                    $match: {
                        $or: [
                            { "user.username": { $regex: searchWith, $options: "i" } },
                            { "user.email": { $regex: searchWith, $options: "i" } }
                        ]
                    }
                }
            );
        }

        return await Laborer.aggregate(pipeline);
    };

    async getLaborer(id) {
        const laborer = await Laborer.aggregate([
            {
                $match: { userId: new mongoose.Types.ObjectId(id) }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $project: {
                    _id: 1,
                    languages: 1,
                    education: 1,
                    avlDays: 1,
                    avlTimes: 1,
                    fields: 1,
                    user: {
                        location: "$user.location",
                        _id: "$user._id",
                        username: "$user.username",
                        email: "$user.email",
                        profile: "$user.profile"
                    }
                }
            }
        ]);

        return laborer[0];
    };

    // profile
    async updateLaborerProfile(data) {
        await Laborer.findOneAndUpdate({
            userId: data.userId
        },
            {
                $set: {
                    ...data
                }
            },
            { new: true }
        );
    };
};

module.exports = LaborerRepository;
