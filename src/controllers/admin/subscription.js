const sendResponse = require("../../utils/responseStructure");

class SubscriptionController {
    constructor(subscriptionService) {
        this.subscriptionService = subscriptionService;
    };

    async getSubscriptions(req, res) {
        const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
        const currentPage = parseInt(req.query.currentPage);
        const result = await this.subscriptionService.getSubscriptions(itemsPerPage, currentPage);
        sendResponse(res, result);
    };
};

module.exports = SubscriptionController;
