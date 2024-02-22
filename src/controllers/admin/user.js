const userService = require("../../services/admin/user");
const catchAsync = require("../../utils/errorHandling/catchAsync");
const sendResponse = require("../../utils/responseStructure");

exports.getUsers = catchAsync(async (req, res) => {
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
    const currentPage = parseInt(req.query.currentPage);
    const result = await userService.getUsers(itemsPerPage, currentPage);
    sendResponse(res, result);
});

exports.getUser = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await userService.getUser(id);
    sendResponse(res, result);
});

exports.blockUnblockUser = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
    const result = await userService.blockUnblockUser(id, reason);
    sendResponse(res, result);
});

exports.getRequests = catchAsync(async (req, res) => {
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
    const currentPage = parseInt(req.query.currentPage);
    const result = await userService.getRequests(itemsPerPage, currentPage);
    sendResponse(res, result);
});

exports.getRequest = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await userService.getRequest(id);
    sendResponse(res, result);
});

exports.approveRejectAction = catchAsync(async (req, res) => {
    const { requestId, userId, type, reason } = req.body;
    const result = await userService.approveRejectAction(requestId, userId, type, reason);
    sendResponse(res, result);
});
