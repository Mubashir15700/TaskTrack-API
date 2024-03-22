const express = require("express");
const checkUserStatus = require("../../middlewares/auth/checkUserStatus");
const { userHasToken } = require("../../middlewares/auth/hasToken");
const catchAsync = require("../../utils/errorHandling/catchAsync");

const router = express.Router();

const NotificationRepository = require("../../repositories/notification");
const notificationRepository = new NotificationRepository();

const NotificationController = require("../../controllers/notification");
const NotificationService = require("../../services/notification");

const notificationService = new NotificationService(notificationRepository);
const notificationController = new NotificationController(notificationService);

router.get(
    "/count/:id",
    checkUserStatus,
    userHasToken,
    catchAsync(notificationController.getUserNotificationsCount.bind(notificationController))
);
router.get(
    "/:id/:page",
    checkUserStatus,
    userHasToken,
    catchAsync(notificationController.getUserNotifications.bind(notificationController))
);
router.patch(
    "/:id/mark-read",
    checkUserStatus,
    userHasToken,
    catchAsync(notificationController.markUserNotificationRead.bind(notificationController))
);

module.exports = router;
