const express = require("express");
const { adminHasToken } = require("../../middlewares/auth/hasToken");
const catchAsync = require("../../utils/errorHandling/catchAsync");

const router = express.Router();

const NotificationController = require("../../controllers/notification");
const NotificationService = require("../../services/notification");
const NotificationRepository = require("../../repositories/notification");
const notificationRepository = new NotificationRepository();

const notificationService = new NotificationService(notificationRepository);
const notificationController = new NotificationController(notificationService);

router.get("/count", adminHasToken, catchAsync(notificationController.getAdminNotificationsCount.bind(notificationController)));
router.get("/:page", adminHasToken, catchAsync(notificationController.getAdminNotifications.bind(notificationController)));
router.patch(
    "/:id/mark-read",
    adminHasToken,
    catchAsync(notificationController.markAdminNotificationRead.bind(notificationController))
);

module.exports = router;
