const mongoose = require("mongoose");
const User = require("../models/user");
const Request = require("../models/laborerRequest");
const Laborer = require("../models/laborer");

class LaborerRepository {
    async searchLaborers(searchWith) {
        try {
            const searchResults = await User.find({
                $or: [
                    { username: { $regex: searchWith, $options: "i" } },
                    { email: { $regex: searchWith, $options: "i" } },
                ],
                isJobSeeker: true,
            });

            return searchResults;
        } catch (error) {
            console.error(error);
            throw new Error("Error while searching laborers");
        }
    };

    async getRequests(startIndex, itemsPerPage) {
        try {
            return await Request.find({ status: { $eq: "pending" } })
                .skip(startIndex)
                .limit(itemsPerPage);
        } catch (error) {
            console.error(error);
            throw new Error("Error while fetching paginated requests");
        }
    };

    async findRequestsCount() {
        try {
            return await Request.countDocuments({ status: "pending" });
        } catch (error) {
            console.error(error);
            throw new Error("Error while fetching request's count");
        }
    };

    async getRequest(id) {
        try {
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
        } catch (error) {
            console.error(error);
            throw new Error("Error while fetching request");
        }
    };

    async approveRejectAction(id, type) {
        try {
            return await Request.findByIdAndUpdate(id, {
                $set: { status: type }
            }, { new: true });
        } catch (error) {
            console.error(error);
            throw new Error("Error while updating request");
        }
    };

    async saveLaborerDetails(data) {
        try {
            const newLaborer = new Laborer(data);
            return await newLaborer.save();
        } catch (error) {
            console.error(error);
            throw new Error("Error while saving laborer");
        }
    };

    async changeToJobSeeker(id) {
        try {
            return await User.findByIdAndUpdate(id, {
                $set: { isJobSeeker: true }
            }, { new: true });
        } catch (error) {
            console.error(error);
            throw new Error("Error while updating user");
        }
    };

    async getLaborers() {
        try {
            return await Laborer.find({ isJobSeeker: true }).select("-password");
        } catch (error) {
            console.log(error);
            throw new Error("Error while finding laborers");
        }
    };

    async getLaborer(id) {
        try {
            return await Laborer.findOne({ userId: id }).select("-password");
        } catch (error) {
            console.log(error);
            throw new Error("Error while finding the laborer");
        }
    };

    async saveRequest(data) {
        try {
            const newRequest = new Request(data);
            return await newRequest.save();
        } catch (error) {
            console.log(error);
            throw new Error("Error while saving laborer request");
        }
    };

    async getPrevRequest(userId) {
        try {
            return await Request.findOne({ userId });
        } catch (error) {
            console.log(error);
            throw new Error("Error while finding prev become laborer request");
        }
    };

    async updateRequest(data) {
        try {
            return await Request.findOneAndUpdate(
                { userId: data.userId },
                { $set: data },
                { new: true, select: "-_id -status -createdAt" });
        } catch (error) {
            console.log(error);
            throw new Error("Error while updating laborer request");
        }
    };

    async cancelRequest(id) {
        try {
            return await Request.findOneAndDelete(
                { userId: id }
            );
        } catch (error) {
            console.log(error);
            throw new Error("Error while cancelling laborer request");
        }
    };

};

module.exports = new LaborerRepository();
