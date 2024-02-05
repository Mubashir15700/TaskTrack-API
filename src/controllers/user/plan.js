const planService = require("../../services/user/plan");
const catchAsync = require("../../utils/errorHandling/catchAsync");
const sendResponse = require("../../utils/responseStructure");

exports.getPlans = catchAsync(async (req, res) => {
    const result = await planService.getPlans();
    sendResponse(res, result);
});

exports.getPlan = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await planService.getPlan(id);
    sendResponse(res, result);
});
