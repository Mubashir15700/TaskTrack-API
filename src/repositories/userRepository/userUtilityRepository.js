const Banner = require("../../models/bannerModel");

class UserUtilityRepository {
    async getBanners() {
        try {
            return await Banner.find({ isActive: true });
        } catch (error) {
            console.error(error);
            throw new Error("Error while finding banners");
        }
    };
};

module.exports = new UserUtilityRepository();
