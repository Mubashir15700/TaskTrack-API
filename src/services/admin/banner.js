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
            return serverErrorHandler(error.message);
        }
    };

    async addBanner(title, description, bannerImage) {
        try {
            if (!title || !description || !bannerImage) {
               throw new Error("All fields (title, description, Image) are required");
            }

            // Check if a banner with the same title already exists
            const bannerExists = await this.checkBannerExistsByTitle(title);
            if (bannerExists) {
               throw new Error("A banner with the same title already exists");
            }

            await bannerRepository.addBanner(title, description, bannerImage);

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

            if (!banner) {
               throw new Error("No banner found");
            }

            return {
                status: 200,
                message: "Found banner",
                data: {
                    banner
                }
            };
        } catch (error) {
            return serverErrorHandler(error.message);
        }
    };

    async editBanner(id, title, description, bannerImage) {
        try {
            if (!title || !description || !bannerImage) {
               throw new Error("All fields (title, description, Image) are required");
            }

            // Check if a banner with the same title already exists
            const bannerExists = await this.checkBannerExistsByTitle(title, id);
            if (bannerExists) {
               throw new Error("A banner with the same title already exists");
            }

            await bannerRepository.editBanner(id, title, description, bannerImage);

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
