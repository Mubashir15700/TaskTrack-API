const { getPresignedUrl } = require("../../middlewares/imageUpload/s3Upload");

class UserUtilityService {
    constructor(bannerRepository, chatRepository, conversationRepository) {
        this.bannerRepository = bannerRepository;
        this.chatRepository = chatRepository;
        this.conversationRepository = conversationRepository;
    };

    async getBanners() {
        const banners = await this.bannerRepository.getBanners();

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
    };

    async getChatLists(userId) {
        const chats = await this.conversationRepository.findPreviousConversations(userId);

        return {
            status: 200,
            message: "get chats success",
            data: {
                chats
            }
        };
    };

    async updateMessagesReadStatus(ids) {
        await this.chatRepository.updateMessagesReadStatus(ids);

        return {
            status: 200,
            message: "mark messages read success",
        };
    };
};

module.exports = UserUtilityService;
