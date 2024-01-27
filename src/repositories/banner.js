const Banner = require("../models/banner");

class BannerRepository {
    async checkBannerExistsByTitle(query) {
        try {
            return await Banner.findOne(query);
        } catch (error) {
            console.log(error);
            throw new Error("Error while finding banner");
        }
    };

    async findbannersCount() {
        try {
            return await Banner.countDocuments();
        } catch (error) {
            console.log(error);
            throw new Error("Error while finding banners count");
        }
    };

    async getAdminBanners(startIndex, itemsPerPage) {
        try {
            return await Banner.find()
                .sort("order")
                .skip(startIndex)
                .limit(itemsPerPage);
        } catch (error) {
            console.log(error);
            throw new Error("Error while finding banners");
        }
    };

    async addBanner(title, description, image) {
        try {
            await Banner.create({ title, description, image });
        } catch (error) {
            console.log(error);
            throw new Error("Error while adding banner");
        }
    };

    async searchBanners(searchWith) {
        try {
            const searchResults = await Banner.find({
                $or: [
                    { title: { $regex: searchWith, $options: "i" } },
                    { description: { $regex: searchWith, $options: "i" } },
                ],
            });
            return searchResults;
        } catch (error) {
            console.error(error);
            throw new Error("Error while searching banners");
        }
    };

    async listUnlistBanner(id) {
        try {
            const banner = await Banner.findById(id);
            const activeState = banner.isActive;

            return await Banner.findByIdAndUpdate(id, {
                $set: { isActive: !activeState },
            });
        } catch (error) {
            console.log(error);
            throw new Error("Error while updating banners");
        }
    };

    async getBanner(id) {
        try {
            return await Banner.findById(id);
        } catch (error) {
            console.log(error);
            throw new Error("Error while finding banner");
        }
    };

    async editBanner(id, title, description, image) {
        try {
            await Banner.findByIdAndUpdate(id,
                { title, description, image },
                { new: true }
            );
        } catch (error) {
            console.log(error);
            throw new Error("Error while editing banner");
        }
    };

    async getBanners() {
        try {
            return await Banner.find({ isActive: true }).sort("order");
        } catch (error) {
            console.error(error);
            throw new Error("Error while finding banners");
        }
    };

    async changeBannerOrder(newOrder, prevOrder) {
        try {
            return await Banner.findOneAndUpdate(
                { order: newOrder },
                { $set: { order: prevOrder } },
                { new: true }
            );
        } catch (error) {
            console.error(error);
            throw new Error("Error while changing banner order");
        }
    };

    async dragBanner(id, newOrder) {
        try {
            return await Banner.findByIdAndUpdate(
                id,
                { $set: { order: newOrder } },
                { new: true }
            );
        } catch (error) {
            console.error(error);
            throw new Error("Error while dragging banner");
        }
    };
};

module.exports = new BannerRepository();
