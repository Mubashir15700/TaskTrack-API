const planService = require("../../services/user/plan");
const catchAsync = require("../../utils/catchAsync");
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

exports.createSubscription = catchAsync(async (req, res) => {
    const userData = req.body.user;
    const planData = req.body.item;
    const result = await planService.createSubscription(userData, planData);
    sendResponse(res, result);
});

exports.saveSubscriptionResult = catchAsync(async (req, res) => {
    const sessionId = req.cookies.sessionId;
    const result = await planService.saveSubscriptionResult(sessionId);
    sendResponse(res, result);
});
