const bannerRepository = require("../../repositories/banner");
const serverErrorHandler = require("../../utils/serverErrorHandler");

class UserUtilityService {
    async getBanners() {
        try {
            const banners = await bannerRepository.getBanners();

            return {
                status: 201,
                message: "get banners success",
                data: {
                    banners
                }
            };
        } catch (error) {
            return serverErrorHandler("An error occurred during fetching banners: ", error);
        }
    };
};

module.exports = new UserUtilityService();
