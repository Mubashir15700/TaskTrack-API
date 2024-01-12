const User = require("../../models/userModel");

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

};

module.exports = new LaborerRepository();
