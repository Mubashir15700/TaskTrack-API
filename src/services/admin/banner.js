const bannerRepository = require("../../repositories/banner");
const serverErrorHandler = require("../../utils/errorHandling/serverErrorHandler");
const { getPresignedUrl, deleteImage } = require("../../middlewares/imageUpload/s3Upload");

class BannerService {
    async checkBannerExistsByTitle(title, id = null) {
        // Build the query
        const query = { title };
        if (id) {
            query._id = { $ne: id }; // Exclude the specified id
        }
        const bannerExists = await bannerRepository.checkBannerExistsByTitle(query);
        if (bannerExists) {
            return true;
        }
        return false;
    };

    async getBanners(itemsPerPage, currentPage) {
        try {
            const startIndex = (currentPage) * itemsPerPage;
            const banners = await bannerRepository.getAdminBanners(startIndex, itemsPerPage);
            const totalBanners = await bannerRepository.findbannersCount();
            const totalPages = Math.ceil(totalBanners / itemsPerPage);

            // Map over the banners array and get presigned URL for each image
            const bannersWithPresignedUrls = await Promise.all(banners.map(async banner => {
                // Get the presigned URL for the image
                const imageUrl = await getPresignedUrl(banner.key);
                // Return a new object with the image URL and other properties from the banner
                return { ...banner._doc, image: imageUrl };
            }));

            return {
                status: 200,
                message: "Found banners",
                data: {
                    banners: bannersWithPresignedUrls,
                    totalPages
                }
            };
        } catch (error) {
            return serverErrorHandler(error.message);
        }
    };

    async addBanner(title, description, key) {
        try {
            if (!title || !description) {
                throw new Error("All fields (title, description) are required");
            }

            // Check if a banner with the same title already exists
            const bannerExists = await this.checkBannerExistsByTitle(title);
            if (bannerExists) {
                throw new Error("A banner with the same title already exists");
            }

            await bannerRepository.addBanner(title, description, key);

            return {
                status: 200,
                message: "Banner added success",
            };
        } catch (error) {
            return serverErrorHandler(error.message);
        }
    };

    async listUnlistBanner(id) {
        try {
            const updatedBanner = await bannerRepository.listUnlistBanner(id);

            if (!updatedBanner) {
                throw new Error("No banner found");
            }

            return {
                status: 200,
                message: "Updated banner"
            };
        } catch (error) {
            return serverErrorHandler(error.message);
        }
    };

    async getBanner(id) {
        try {
            const banner = await bannerRepository.getBanner(id);

            const imageUrl = await getPresignedUrl(banner.key);

            if (!banner) {
                throw new Error("No banner found");
            }

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
        } catch (error) {
            return serverErrorHandler(error.message);
        }
    };

    async editBanner(id, title, description, key) {
        try {
            if (!title || !description) {
                throw new Error("All fields (title, description) are required");
            }

            // Check if a banner with the same title already exists
            const bannerExists = await this.checkBannerExistsByTitle(title, id);
            if (bannerExists) {
                throw new Error("A banner with the same title already exists");
            }

            const prevImageKey = await bannerRepository.getBannerImageKey(id);

            await bannerRepository.editBanner(id, title, description, key);
            await deleteImage(prevImageKey.key);

            return {
                status: 200,
                message: "Banner edited success",
            };
        } catch (error) {
            return serverErrorHandler(error.message);
        }
    };

    async updateBannerOrder(data) {
        try {
            const id = data.draggedBannerId
            const prevOrder = data.prevOrder + 1;
            const newOrder = data.newOrder + 1;
            await bannerRepository.changeBannerOrder(newOrder + 1, prevOrder + 1);
            await bannerRepository.dragBanner(id, newOrder + 1);

            return {
                status: 200,
                message: "Updated banner order"
            };
        } catch (error) {
            return serverErrorHandler(error.message);
        }
    };
};

module.exports = new BannerService();
