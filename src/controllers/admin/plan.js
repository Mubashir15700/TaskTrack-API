const planService = require("../../services/admin/plan");
const catchAsync = require("../../utils/catchAsync");
const sendResponse = require("../../utils/responseStructure");

exports.getPlans = catchAsync(async (req, res) => {
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
    const currentPage = parseInt(req.query.currentPage);
    const result = await planService.getPlans(itemsPerPage, currentPage);
    sendResponse(res, result);
});

exports.getPlan = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await planService.getPlan(id);
    sendResponse(res, result);
});

exports.addPlan = catchAsync(async (req, res) => {
    const { name, description, type, numberOfJobPosts, amount } = req.body;
    const result = await planService.addPlan(
        name, description, type, numberOfJobPosts, amount
    );
    sendResponse(res, result);
});

exports.editPlan = catchAsync(async (req, res) => {
    const { _id, name, description, type, numberOfJobPosts, amount } = req.body;
    const result = await planService.editPlan(_id, name, description, type, numberOfJobPosts, amount);
    sendResponse(res, result);
});

exports.listUnlistPlan = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await planService.listUnlistPlan(id);
    sendResponse(res, result);
});

exports.getSubscriptions = catchAsync(async (req, res) => {
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
    const currentPage = parseInt(req.query.currentPage);
    const result = await planService.getSubscriptions(itemsPerPage, currentPage);
    sendResponse(res, result);
});
