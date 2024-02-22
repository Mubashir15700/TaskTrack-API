const bannerRepository = require("../../repositories/banner");
const chatRepository = require("../../repositories/chat");
const { getPresignedUrl } = require("../../middlewares/imageUpload/s3Upload");
const serverErrorHandler = require("../../utils/errorHandling/serverErrorHandler");

class UserUtilityService {
    async getBanners() {
        try {
            const banners = await bannerRepository.getBanners();

            // Map over the banners array and get presigned URL for each image
            const bannersWithPresignedUrls = await Promise.all(banners.map(async banner => {
                // Get the presigned URL for the image
                const imageUrl = await getPresignedUrl(banner.key);
                // Return a new object with the image URL and other properties from the banner
                return { ...banner._doc, image: imageUrl };
            }));

            return {
                status: 200,
                message: "get banners success",
                data: {
                    banners: bannersWithPresignedUrls
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
            return serverErrorHandler(error.message);
        }
    };
};

module.exports = new UserUtilityService();
