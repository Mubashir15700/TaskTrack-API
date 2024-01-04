const adminService = require("../services/adminService");
const catchAsync = require("../utils/catchAsync");
const sendResponse = require("../utils/responseStructure");

exports.search = catchAsync(async (req, res) => {
    const { searchWith, searchOn } = req.body;
    const result = await adminService.search(searchWith, searchOn);
    sendResponse(res, result);
});

exports.getUsers = catchAsync(async (req, res) => {
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
    const currentPage = parseInt(req.query.currentPage);
    const result = await adminService.getUsers(itemsPerPage, currentPage);
    sendResponse(res, result);
});

exports.getUser = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await adminService.getUser(id);
    sendResponse(res, result);
});

exports.blockUnblockUser = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await adminService.blockUnblockUser(id);
    sendResponse(res, result);
});