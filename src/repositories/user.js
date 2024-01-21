const mongoose = require("mongoose");
const User = require("../models/user");
const Request = require("../models/laborerRequest");

class UserRepository {
    async findUsersPaginated(startIndex, itemsPerPage) {
        try {
            return await User.find()
                .skip(startIndex)
                .limit(itemsPerPage)
                .select("-password");
        } catch (error) {
            console.error(error);
            throw new Error("Error while fetching paginated users");
        }
    };

    async findUsersCount() {
        try {
            return await User.countDocuments();
        } catch (error) {
            console.error(error);
            throw new Error("Error while fetching user's count");
        }
    };

    async findUserById(id) {
        try {
            return await User.findById(id).select("-password");
        } catch (error) {
            console.error(error);
            throw new Error("Error while fetching user");
        }
    };

    async blockUnblockUser(id) {
        try {
            const user = await User.findById(id);
            const blockState = user.isBlocked;

            return await User.findByIdAndUpdate(id, {
                $set: { isBlocked: !blockState },
            });
        } catch (error) {
            console.error(error);
            throw new Error("Error while updating user");
        }
    };

    // searching
    async searchEmployers(searchWith) {
        try {
            const searchResults = await User.find({
                $or: [
                    { username: { $regex: searchWith, $options: "i" } },
                    { email: { $regex: searchWith, $options: "i" } },
                ],
                isJobSeeker: false,
            });
            return searchResults;
        } catch (error) {
            console.error(error);
            throw new Error("Error while searching employers");
        }
    };

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
            return await Request.find({ status: { $ne: "cancelled" } })
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
};

module.exports = new UserRepository();
