const notificationService = require("../services/notification");
const catchAsync = require("../utils/errorHandling/catchAsync");
const sendResponse = require("../utils/responseStructure");

// admin
exports.getAdminNotificationsCount = catchAsync(async (req, res) => {
    const result = await notificationService.getAdminNotificationsCount();
    sendResponse(res, result);
});

exports.getAdminNotifications = catchAsync(async (req, res) => {
    const result = await notificationService.getAdminNotifications();
    sendResponse(res, result);
});

exports.getAdminNotification = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await notificationService.getAdminNotification(id);
    sendResponse(res, result);
});

exports.markAdminNotificationRead = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await notificationService.markAdminNotificationRead(id);
    sendResponse(res, result);
});

// user
exports.getUserNotificationsCount = catchAsync(async (req, res) => {
    const { id } = req.params
    const result = await notificationService.getUserNotificationsCount(id);
    sendResponse(res, result);
});

exports.getUserNotifications = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await notificationService.getUserNotifications(id);
    sendResponse(res, result);
});

exports.getUserNotification = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await notificationService.getUserNotification(id);
    sendResponse(res, result);
});

exports.markUserNotificationRead = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await notificationService.markUserNotificationRead(id);
    sendResponse(res, result);
});
