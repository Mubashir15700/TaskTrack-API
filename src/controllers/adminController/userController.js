const userService = require("../../services/adminService/userService");
const catchAsync = require("../../utils/catchAsync");
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
    const result = await userService.blockUnblockUser(id);
    sendResponse(res, result);
});
