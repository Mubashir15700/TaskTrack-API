const bannerRepository = require("../../repositories/banner");

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
            const banners = await bannerRepository.getBanners(startIndex, itemsPerPage);

            if (!banners.length) {
                return { status: 400, message: "No banners found" };
            }

            const totalBanners = await bannerRepository.findbannersCount();
            const totalPages = Math.ceil(totalBanners / itemsPerPage);

            return {
                status: 201,
                message: "Found banners",
                data: {
                    banners,
                    totalPages
                }
            };
        } catch (error) {
            console.log(error);
            return {
                status: 500, message: `Internal Server Error: ${error.message}`
            };
        }
    };

    async addBanner(title, description, bannerImage) {
        try {
            console.log(title, description, bannerImage);
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
                status: 201,
                message: "Banner added success",
            };
        } catch (error) {
            console.log(error);
            return {
                status: 500, message: `Internal Server Error: ${error.message}`
            };
        }
    };

    async listUnlistBanner(id) {
        try {
            const updatedBanner = await bannerRepository.listUnlistBanner(id);

            if (!updatedBanner) {
                return { status: 400, message: "No banner found" };
            }

            return {
                status: 201,
                message: "Updated banner"
            };
        } catch (error) {
            console.log(error);
            return {
                status: 500, message: `Internal Server Error: ${error.message}`
            };
        }
    };

    async getBanner(id) {
        try {
            const banner = await bannerRepository.getBanner(id);

            if (!banner) {
                return { status: 400, message: "No banner found" };
            }

            return {
                status: 201,
                message: "Found banner",
                data: {
                    banner
                }
            };
        } catch (error) {
            console.log(error);
            return {
                status: 500, message: `Internal Server Error: ${error.message}`
            };
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
                status: 201,
                message: "Banner edited success",
            };
        } catch (error) {
            console.log(error);
            return {
                status: 500, message: `Internal Server Error: ${error.message}`
            };
        }
    };

    async updateBannerOrder(data) {
        try {
            const id = data.draggedBannerId
            const prevOrder = data.prevOrder + 1;
            const newOrder = data.newOrder + 1;
            const bannerToUpdate = await bannerRepository.changeBannerOrder(newOrder + 1, prevOrder + 1);
            const draggedBanner = await bannerRepository.dragBanner(id, newOrder + 1);

            return {
                status: 201,
                message: "Updated banner order"
            };
        } catch (error) {
            console.log(error);
            return {
                status: 500, message: `Internal Server Error: ${error.message}`
            };
        }
    };
};

module.exports = new BannerService();
