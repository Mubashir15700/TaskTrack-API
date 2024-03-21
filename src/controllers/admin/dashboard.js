const sendResponse = require("../../utils/responseStructure");

class DashboardController {
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    };

    async getData(req, res) {
        const result = await this.dashboardService.getData();
        sendResponse(res, result);
    };
};

module.exports = DashboardController;
