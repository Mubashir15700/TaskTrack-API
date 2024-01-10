const planService = require("../../services/adminService/planService");
const catchAsync = require("../../utils/catchAsync");
const sendResponse = require("../../utils/responseStructure");

exports.getPlans = catchAsync(async (req, res) => {
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
    const currentPage = parseInt(req.query.currentPage);
    // const result = await planService.getPlans(itemsPerPage, currentPage);
    // sendResponse(res, result);
});

exports.getPlan = catchAsync(async (req, res) => {
    console.log(req.body);
    // sendResponse(res, result);
});

exports.addPlan = catchAsync(async (req, res) => {
    console.log(req.body);
    // sendResponse(res, result);
});

exports.editPlan = catchAsync(async (req, res) => {
    console.log(req.body);
    // sendResponse(res, result);
});

exports.listUnlistPlan = catchAsync(async (req, res) => {
    console.log(req.body);
    // sendResponse(res, result);
});
