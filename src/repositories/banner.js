const Banner = require("../models/banner");

class BannerRepository {
    async getBanner(id) {
        return await Banner.findById(id);
    };

    async checkBannerExistsByTitle(query) {
        return await Banner.findOne(query);
    };

    async findbannersCount() {
        return await Banner.countDocuments();
    };

    async getAdminBanners(startIndex, itemsPerPage) {
        return await Banner.find()
            .sort("order")
            .skip(startIndex)
            .limit(itemsPerPage);
    };

    async addBanner(title, description, key) {
        await Banner.create({ title, description, key });
    };

    async searchBanners(searchWith) {
        return await Banner.find({
            $or: [
                { title: { $regex: searchWith, $options: "i" } },
                { description: { $regex: searchWith, $options: "i" } },
            ],
        });
    };

    async listUnlistBanner(id) {
        const banner = await this.getBanner(id);
        const activeState = banner.isActive;

        return await Banner.findByIdAndUpdate(id, {
            $set: { isActive: !activeState },
        });
    };

    async getBannerImageKey(id) {
        return await Banner.findById(id, { key: 1, _id: 0 });
    };

    async editBanner(updateObject) {
        return await Banner.findByIdAndUpdate(updateObject.id,
            { $set: updateObject },
            { new: true }
        );
    };

    async getBanners() {
        return await Banner.find({ isActive: true }).sort("order");
    };

    async changeBannerOrder(newOrder, prevOrder) {
        return await Banner.findOneAndUpdate(
            { order: newOrder },
            { $set: { order: prevOrder } },
            { new: true }
        );
    };

    async dragBanner(id, newOrder) {
        return await Banner.findByIdAndUpdate(id,
            { $set: { order: newOrder } },
            { new: true }
        );
    };
};

module.exports = BannerRepository;
