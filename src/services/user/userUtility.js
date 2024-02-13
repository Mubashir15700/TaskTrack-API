const bannerRepository = require("../../repositories/banner");
const chatRepository = require("../../repositories/chat");
const serverErrorHandler = require("../../utils/errorHandling/serverErrorHandler");

class UserUtilityService {
    async getBanners() {
        try {
            const banners = await bannerRepository.getBanners();

            return {
                status: 200,
                message: "get banners success",
                data: {
                    banners
                }
            };
        } catch (error) {
            return serverErrorHandler("An error occurred during fetching banners: ", error);
        }
    };

    async updateMessagesReadStatus(ids) {
        try {
            await chatRepository.updateMessagesReadStatus(ids);

            return {
                status: 200,
                message: "mark messages read success",
            };
        } catch (error) {
            return serverErrorHandler("An error occurred during marking messages read: ", error);
        }
    };
};

module.exports = new UserUtilityService();
