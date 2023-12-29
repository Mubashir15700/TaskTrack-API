const adminService = require('../services/adminService');
const catchAsync = require('../utils/catchAsync');
const sendResponse = require('../utils/responseStructure');

exports.getUsers = catchAsync(async (req, res) => {
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
    const currentPage = parseInt(req.query.currentPage);
    const result = await adminService.getUsers(itemsPerPage, currentPage);
    const { status, message, data } = result;
    sendResponse(res, { status, message, data: data || {} });
});

exports.getUser = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await adminService.getUser(id);
    const { status, message, data } = result;
    sendResponse(res, { status, message, data: data || {} });
});

exports.blockUnblockUser = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await adminService.blockUnblockUser(id);
    const { status, message, data } = result;
    sendResponse(res, { status, message, data: data || {} });
});