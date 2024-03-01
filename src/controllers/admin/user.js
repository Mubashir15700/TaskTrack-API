const sendResponse = require("../../utils/responseStructure");

class UserController {
    constructor(userService) {
        this.userService = userService;
    };

    async getUsers(req, res) {
        const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
        const currentPage = parseInt(req.query.currentPage);
        const result = await this.userService.getUsers(itemsPerPage, currentPage);
        sendResponse(res, result);
    };

    async getUser(req, res) {
        const { id } = req.params;
        const result = await this.userService.getUser(id);
        sendResponse(res, result);
    };

    async blockUnblockUser(req, res) {
        const { id } = req.params;
        const { reason } = req.body;
        const result = await this.userService.blockUnblockUser(id, reason);
        sendResponse(res, result);
    };

    async getRequests(req, res) {
        const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
        const currentPage = parseInt(req.query.currentPage);
        const result = await this.userService.getRequests(itemsPerPage, currentPage);
        sendResponse(res, result);
    };

    async getRequest(req, res) {
        const { id } = req.params;
        const result = await this.userService.getRequest(id);
        sendResponse(res, result);
    };

    async approveRejectAction(req, res) {
        const { requestId, userId, type, reason } = req.body;
        const result = await this.userService.approveRejectAction(requestId, userId, type, reason);
        sendResponse(res, result);
    };
};

module.exports = UserController;
