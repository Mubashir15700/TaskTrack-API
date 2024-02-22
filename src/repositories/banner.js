const Banner = require("../models/banner");
const repositoryErrorHandler = require("../utils/errorHandling/repositoryErrorHandler");

class BannerRepository {
    async checkBannerExistsByTitle(query) {
        try {
            return await Banner.findOne(query);
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };

    async findbannersCount() {
        try {
            return await Banner.countDocuments();
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };

    async getAdminBanners(startIndex, itemsPerPage) {
        try {
            return await Banner.find()
                .sort("order")
                .skip(startIndex)
                .limit(itemsPerPage);
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };

    async addBanner(title, description, key) {
        try {
            await Banner.create({ title, description, key });
        } catch (error) {
            repositoryErrorHandler(error);
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
            repositoryErrorHandler(error);
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
            repositoryErrorHandler(error);
        }
    };

    async getBanner(id) {
        try {
            return await Banner.findById(id);
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };

    async getBannerImageKey(id) {
        try {
            return await Banner.findById(id, { key: 1, _id: 0 });
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };

    async editBanner(id, title, description, key) {
        try {
            await Banner.findByIdAndUpdate(id,
                { title, description, key },
                { new: true }
            );
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };

    async getBanners() {
        try {
            return await Banner.find({ isActive: true }).sort("order");
        } catch (error) {
            repositoryErrorHandler(error);
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
            repositoryErrorHandler(error);
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
            repositoryErrorHandler(error);
        }
    };
};

module.exports = new BannerRepository();
