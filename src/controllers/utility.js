const sendResponse = require("../utils/responseStructure");

class UtilityController {
    constructor(utilityService) {
        this.utilityService = utilityService;
    };

    async search(req, res) {
        const { currentUserId, searchWith, searchOn } = req.query;
        const result = await this.utilityService.search(currentUserId, searchWith, searchOn);
        sendResponse(res, result);
    };
};

module.exports = UtilityController;
