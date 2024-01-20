const Banner = require("../../models/banner");

class UserUtilityRepository {
    async getBanners() {
        try {
            return await Banner.find({ isActive: true }).sort("order");
        } catch (error) {
            console.error(error);
            throw new Error("Error while finding banners");
        }
    };
};

module.exports = new UserUtilityRepository();
