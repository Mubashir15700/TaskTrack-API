const sendResponse = require("../../utils/responseStructure");

class SubscriptionController {
    constructor(subscriptionService) {
        this.subscriptionService = subscriptionService;
    };

    async getStripePublicKey(req, res) {
        const result = await this.subscriptionService.getStripePublicKey();
        sendResponse(res, result);
    };

    async createSubscription(req, res) {
        const { user, item } = req.body;
        const result = await this.subscriptionService.createSubscription(user, item);
        sendResponse(res, result);
    };

    async saveSubscriptionResult(req, res) {
        const { sessionId } = req.body;
        const result = await this.subscriptionService.saveSubscriptionResult(sessionId);
        sendResponse(res, result);
    };

    async getActivePlan(req, res) {
        const { subscriptionId } = req.query;
        const result = await this.subscriptionService.getActivePlan(subscriptionId);
        sendResponse(res, result);
    };

    async testWebhook(req, res) {
        const sig = req.headers["stripe-signature"];
        const payload = req.body;
        const result = await this.subscriptionService.testWebhook(payload, sig);
        sendResponse(res, result);
    };
};

module.exports = SubscriptionController;
