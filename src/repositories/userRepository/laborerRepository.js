const User = require("../../models/userModel");
const Request = require("../../models/laborerRequestModel");

class LaborerRepository {
    async getLaborers() {
        try {
            return await User.find({ isJobSeeker: true }).select("-password");
        } catch (error) {
            console.log(error);
            throw new Error("Error while finding laborers");
        }
    };

    async getLaborer(id) {
        try {
            return await User.findById(id).select("-password");
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
            return await Request.findOne({ userId, status: { $nin: ["approved", "cancelled"] } });
        } catch (error) {
            console.log(error);
            throw new Error("Error while finding prev become laborer request");
        }
    };

    async updateRequest(data) {
        try {
            return await Request.findOneAndUpdate(
                { userId: data.userId, status: "pending" },
                { $set: data },
                { new: true, select: "-_id -status -createdAt" });
        } catch (error) {
            console.log(error);
            throw new Error("Error while updating laborer request");
        }
    };

    async cancelRequest(id) {
        try {
            return await Request.findOneAndUpdate(
                { userId: id, status: { $ne: "cancelled" } },
                { $set: { status: "cancelled" } },
                { new: true }
            );
        } catch (error) {
            console.log(error);
            throw new Error("Error while cancelling laborer request");
        }
    };
};

module.exports = new LaborerRepository();
