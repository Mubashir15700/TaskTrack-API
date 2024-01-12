const userUtilityRepository = require("../../repositories/userRepository/userUtilityRepository");

class UserUtilityService {
    async getBanners() {
        try {
            const banners = await userUtilityRepository.getBanners();

            return {
                status: 201,
                message: "get banners success",
                data: {
                    banners
                }
            };
        } catch (error) {
            console.log(error);
            return {
                status: 500, message: `Internal Server Error: ${error.message}`
            };
        }
    };
};

module.exports = new UserUtilityService();
