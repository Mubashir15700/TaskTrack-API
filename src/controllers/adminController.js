const adminService = require('../services/adminService');
const adminRepository = require('../repositories/adminRepository');
const catchAsync = require('../utils/catchAsync');
const sendResponse = require('../utils/responseStructure');

exports.search = catchAsync(async (req, res) => {
    const { searchWith, searchOn } = req.body;
    let result;
    if (searchOn === 'employers') {
        result = await adminRepository.searchEmployers(searchWith);
    } else if (searchOn === 'laborers') {
        result = await adminRepository.searchLaborers(searchWith);
    } else if (searchOn === 'plans') {
        result = await adminRepository.searchPlans(searchWith);
    } else {
        result = await adminRepository.searchBanners(searchWith);
    }
    sendResponse(res, {
        status: 201,
        message: 'Search success',
        data: {
            result: result || {}
        }
    });
});

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