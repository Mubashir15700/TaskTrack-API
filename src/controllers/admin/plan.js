const sendResponse = require("../../utils/responseStructure");

class PlanController {
    constructor(planService) {
        this.planService = planService;
    };

    async getPlans(req, res) {
        const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
        const currentPage = parseInt(req.query.currentPage);
        const result = await this.planService.getPlans(itemsPerPage, currentPage);
        sendResponse(res, result);
    };

    async getPlan(req, res) {
        const { id } = req.params;
        const result = await this.planService.getPlan(id);
        sendResponse(res, result);
    };

    async addPlan(req, res) {
        const { name, description, type, numberOfJobPosts, amount } = req.body;
        const result = await this.planService.addPlan(
            name, description, type, numberOfJobPosts, amount
        );
        sendResponse(res, result);
    };

    async editPlan(req, res) {
        const { _id, name, description, type, numberOfJobPosts, amount } = req.body;
        const result = await this.planService.editPlan(
            _id, name, description, type, numberOfJobPosts, amount
        );
        sendResponse(res, result);
    };

    async listUnlistPlan(req, res) {
        const { id } = req.params;
        const result = await this.planService.listUnlistPlan(id);
        sendResponse(res, result);
    };
};

module.exports = PlanController;
