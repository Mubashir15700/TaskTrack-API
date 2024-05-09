const sendResponse = require("../../utils/responseStructure");

class BannerController {
    constructor(bannerService) {
        this.bannerService = bannerService;
    };

    async getBanners(req, res) {
        const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
        const currentPage = parseInt(req.query.currentPage);
        const result = await this.bannerService.getBanners(itemsPerPage, currentPage);
        sendResponse(res, result);
    };

    async getBanner(req, res) {
        const { id } = req.params;
        const result = await this.bannerService.getBanner(id);
        sendResponse(res, result);
    };

    async addBanner(req, res) {
        const { title, description } = req.body;
        const { key } = req.file;
        const result = await this.bannerService.addBanner(
            title, description, key
        );
        sendResponse(res, result);
    };

    async editBanner(req, res) {
        const { id, title, description } = req.body;
        let key = null;
        if (req.file) {
            key = req.file.key;
        };

        const result = await this.bannerService.editBanner(
            id, title, description, key
        );
        sendResponse(res, result);
    };

    async listUnlistBanner(req, res) {
        const { id } = req.params;
        const result = await this.bannerService.listUnlistBanner(id);
        sendResponse(res, result);
    };

    async updateBannerOrder(req, res) {
        const { data } = req.body;
        const result = await this.bannerService.updateBannerOrder(data);
        sendResponse(res, result);
    };
};

module.exports = BannerController;
