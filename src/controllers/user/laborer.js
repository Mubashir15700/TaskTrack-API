const sendResponse = require("../../utils/responseStructure");

class LaborerController {
    constructor(laborerService) {
        this.laborerService = laborerService;
    };

    async getLaborers(req, res) {
        const { id, page } = req.params;
        const { lat, lon } = req.query;
        const result = await this.laborerService.getLaborers(id, page, lat, lon);
        sendResponse(res, result);
    };

    async getLaborer(req, res) {
        const { id } = req.params;
        const result = await this.laborerService.getLaborer(id);
        sendResponse(res, result);
    };

    async sendRequest(req, res) {
        const { formData } = req.body;
        const result = await this.laborerService.sendRequest(formData);
        sendResponse(res, result);
    };

    async getPrevRequest(req, res) {
        const { id } = req.params;
        const result = await this.laborerService.getPrevRequest(id);
        sendResponse(res, result);
    };

    async updateRequest(req, res) {
        const { formData } = req.body;
        const result = await this.laborerService.updateRequest(formData);
        sendResponse(res, result);
    };

    async cancelRequest(req, res) {
        const { currentUserId } = req.body;
        const result = await this.laborerService.cancelRequest(currentUserId);
        sendResponse(res, result);
    };
};

module.exports = LaborerController;
