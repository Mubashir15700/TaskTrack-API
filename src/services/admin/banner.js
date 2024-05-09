const { getBannerWithPresignedUrl, getBannersWithPresignedUrls } = require("../../utils/getBannersWithImageUrls");
const { deleteImage } = require("../../middlewares/imageUpload/s3Upload");

class BannerService {
    constructor(bannerRepository) {
        this.bannerRepository = bannerRepository;
    };

    async checkBannerExistsByTitle(title, id = null) {
        // Build the query
        const query = { title };
        if (id) {
            query._id = { $ne: id }; // Exclude the specified id
        }
        const bannerExists = await this.bannerRepository.checkBannerExistsByTitle(query);
        if (bannerExists) {
            return true;
        }
        return false;
    };

    async getBanners(itemsPerPage, currentPage) {
        const startIndex = (currentPage) * itemsPerPage;
        const banners = await this.bannerRepository.getAdminBanners(startIndex, itemsPerPage);
        const totalBanners = await this.bannerRepository.findbannersCount();
        const totalPages = Math.ceil(totalBanners / itemsPerPage);

        // Map over the banners array and get presigned URL for each image
        const foundBanners = await getBannersWithPresignedUrls(banners);

        return {
            status: 200,
            message: "Found banners",
            data: {
                banners: foundBanners,
                totalPages
            }
        };
    };

    async addBanner(title, description, key) {
        if (!title || !description) {
            return { status: 400, message: "All fields (title, description) are required" };
        }

        // Check if a banner with the same title already exists
        const bannerExists = await this.checkBannerExistsByTitle(title);
        if (bannerExists) {
            return { status: 409, message: "A banner with the same title already exists" };
        }

        await this.bannerRepository.addBanner(title, description, key);

        return {
            status: 200,
            message: "Banner added successfully",
        };
    };

    async listUnlistBanner(id) {
        const updatedBanner = await this.bannerRepository.listUnlistBanner(id);

        if (!updatedBanner) {
            return { status: 404, message: "No banner found" };
        }

        return {
            status: 200,
            message: "Updated banner"
        };
    };

    async getBanner(id) {
        const banner = await this.bannerRepository.getBanner(id);

        if (!banner) {
            return { status: 404, message: "No banner found" };
        }

        const imageUrl = await getBannerWithPresignedUrl(banner.key);

        const bannerWithImage = {
            ...banner._doc,
            image: imageUrl
        };

        return {
            status: 200,
            message: "Found banner",
            data: {
                banner: bannerWithImage
            }
        };
    };

    async editBanner(id, title, description, key) {
        if (!title || !description) {
            return { status: 400, message: "All fields (title, description) are required" };
        }

        // Check if a banner with the same title already exists
        const bannerExists = await this.checkBannerExistsByTitle(title, id);
        if (bannerExists) {
            return { status: 409, message: "A banner with the same title already exists" };
        }

        const prevImageKey = await this.bannerRepository.getBannerImageKey(id);

        const updateObject = {
            id,
            title,
            description
        };

        if (key) {
            updateObject.key = key;
        }

        await this.bannerRepository.editBanner(updateObject);
        await deleteImage(prevImageKey.key);

        return {
            status: 200,
            message: "Banner edited successfully",
        };
    };

    async updateBannerOrder(data) {
        const id = data.draggedBannerId
        const prevOrder = data.prevOrder + 1;
        const newOrder = data.newOrder + 1;

        await this.bannerRepository.changeBannerOrder(newOrder + 1, prevOrder + 1);
        await this.bannerRepository.dragBanner(id, newOrder + 1);

        return {
            status: 200,
            message: "Updated banner order"
        };
    };
};

module.exports = BannerService;
