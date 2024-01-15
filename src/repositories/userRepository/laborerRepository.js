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
};

module.exports = new LaborerRepository();
