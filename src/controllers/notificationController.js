const notificationService = require("../services/notificationService");
const catchAsync = require("../utils/catchAsync");
const sendResponse = require("../utils/responseStructure");

exports.getAdminNotificationsCount = catchAsync(async (req, res) => {
    const result = await notificationService.getAdminNotificationsCount();
    sendResponse(res, result);
});

exports.getUserNotificationsCount = catchAsync(async (req, res) => {
    const { id } = req.params
    const result = await notificationService.getUserNotificationsCount(id);
    sendResponse(res, result);
});
