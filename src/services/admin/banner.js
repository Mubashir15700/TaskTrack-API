const bannerRepository = require("../../repositories/banner");
const serverErrorHandler = require("../../utils/errorHandling/serverErrorHandler");

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

            if (!banners.length) {
                return { status: 400, message: "No banners found" };
            }

            const totalBanners = await bannerRepository.findbannersCount();
            const totalPages = Math.ceil(totalBanners / itemsPerPage);

            return {
                status: 200,
                message: "Found banners",
                data: {
                    banners,
                    totalPages
                }
            };
        } catch (error) {
            return serverErrorHandler("An error occurred during fetching banners: ", error);
        }
    };

    async addBanner(title, description, bannerImage) {
        try {
            if (!title || !description || !bannerImage) {
                return { status: 400, message: "All fields (title, description, Image) are required" };
            }

            // Check if a banner with the same title already exists
            const bannerExists = await this.checkBannerExistsByTitle(title);
            if (bannerExists) {
                return { status: 400, message: "A banner with the same title already exists" };
            }

            await bannerRepository.addBanner(title, description, bannerImage);

            return {
                status: 200,
                message: "Banner added success",
            };
        } catch (error) {
            return serverErrorHandler("An error occurred during adding new banner: ", error);
        }
    };

    async listUnlistBanner(id) {
        try {
            const updatedBanner = await bannerRepository.listUnlistBanner(id);

            if (!updatedBanner) {
                return { status: 400, message: "No banner found" };
            }

            return {
                status: 200,
                message: "Updated banner"
            };
        } catch (error) {
            return serverErrorHandler("An error occurred during taking banner action: ", error);
        }
    };

    async getBanner(id) {
        try {
            const banner = await bannerRepository.getBanner(id);

            if (!banner) {
                return { status: 400, message: "No banner found" };
            }

            return {
                status: 200,
                message: "Found banner",
                data: {
                    banner
                }
            };
        } catch (error) {
            return serverErrorHandler("An error occurred during fetching banner: ", error);
        }
    };

    async editBanner(id, title, description, bannerImage) {
        try {
            if (!title || !description || !bannerImage) {
                return { status: 400, message: "All fields (title, description, Image) are required" };
            }

            // Check if a banner with the same title already exists
            const bannerExists = await this.checkBannerExistsByTitle(title, id);
            if (bannerExists) {
                return { status: 400, message: "A banner with the same title already exists" };
            }

            await bannerRepository.editBanner(id, title, description, bannerImage);

            return {
                status: 200,
                message: "Banner edited success",
            };
        } catch (error) {
            return serverErrorHandler("An error occurred during editing banner: ", error);
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
            return serverErrorHandler("An error occurred during updating banner order: ", error);
        }
    };
};

module.exports = new BannerService();
