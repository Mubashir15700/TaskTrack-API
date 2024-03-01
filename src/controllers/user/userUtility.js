const sendResponse = require("../../utils/responseStructure");

class UserUtilityController {
    constructor(userUtilityService) {
        this.userUtilityService = userUtilityService;
    };

    async getBanners(req, res) {
        const result = await this.userUtilityService.getBanners();
        sendResponse(res, result);
    };

    async updateMessagesReadStatus(req, res) {
        const messageIds = req.body;
        const result = await this.userUtilityService.updateMessagesReadStatus(messageIds);
        sendResponse(res, result);
    };
};

module.exports = UserUtilityController;
