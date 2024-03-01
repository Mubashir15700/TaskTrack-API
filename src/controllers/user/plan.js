const sendResponse = require("../../utils/responseStructure");

class PlanController {
    constructor(planService) {
        this.planService = planService;
    };

    async getPlans(req, res) {
        const result = await this.planService.getPlans();
        sendResponse(res, result);
    };

    async getPlan(req, res) {
        const { id } = req.params;
        const result = await this.planService.getPlan(id);
        sendResponse(res, result);
    };
};

module.exports = PlanController;
