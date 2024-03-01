const mongoose = require("mongoose");
const Request = require("../models/request");

class RequestRepository {
    async getRequests(startIndex, itemsPerPage) {
        return await Request.find({ status: { $eq: "pending" } })
            .skip(startIndex)
            .limit(itemsPerPage);
    };

    async findRequestsCount() {
        return await Request.countDocuments({ status: "pending" });
    };

    async getRequest(id) {
        const request = await Request.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(id),
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $unwind: "$user",
            },
            {
                $project: {
                    _id: 1,
                    languages: 1,
                    education: 1,
                    avlDays: 1,
                    avlTimes: 1,
                    fields: 1,
                    status: 1,
                    createdAt: 1,
                    user: {
                        _id: 1,
                        username: 1,
                        email: 1,
                        phone: 1,
                        location: 1
                    },
                },
            },
        ]);

        return request[0];
    };

    async approveRejectAction(id, type) {
        return await Request.findByIdAndUpdate(id, {
            $set: { status: type }
        }, { new: true });
    };

    async saveRequest(data) {
        const newRequest = new Request(data);
        return await newRequest.save();
    };

    async getPrevRequest(userId) {
        return await Request.findOne({ userId });
    };

    async updateRequest(data) {
        return await Request.findOneAndUpdate(
            { userId: data.userId },
            { $set: data },
            { new: true, select: "-_id -status -createdAt" });
    };

    async cancelRequest(id) {
        return await Request.findOneAndDelete(
            { userId: id }
        );
    };
};

module.exports = RequestRepository;
