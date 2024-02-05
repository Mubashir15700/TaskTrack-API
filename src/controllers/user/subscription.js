const subscriptionService = require("../../services/user/subscription");
const catchAsync = require("../../utils/errorHandling/catchAsync");
const sendResponse = require("../../utils/responseStructure");

exports.createSubscription = catchAsync(async (req, res) => {
    const userData = req.body.user;
    const planData = req.body.item;
    const result = await subscriptionService.createSubscription(userData, planData);
    sendResponse(res, result);
});

exports.saveSubscriptionResult = catchAsync(async (req, res) => {
    const sessionId = req.cookies.sessionId;
    const result = await subscriptionService.saveSubscriptionResult(sessionId);
    sendResponse(res, result);
});

exports.getActivePlan = catchAsync(async (req, res) => {
    const { subscriptionId } = req.query;
    const result = await subscriptionService.getActivePlan(subscriptionId);
    sendResponse(res, result);
});

exports.cancelActivePlan = catchAsync(async (req, res) => {
    const { subscriptionId, userId } = req.body;
    const result = await subscriptionService.cancelActivePlan(subscriptionId, userId);
    sendResponse(res, result);
});
