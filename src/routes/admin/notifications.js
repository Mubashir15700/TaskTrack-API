const express = require("express");
const hasToken = require("../../middlewares/auth/hasToken");
const catchAsync = require("../../utils/errorHandling/catchAsync");

const router = express.Router();

const NotificationController = require("../../controllers/notification");
const NotificationService = require("../../services/notification");
const NotificationRepository = require("../../repositories/notification");
const notificationRepository = new NotificationRepository();

const notificationService = new NotificationService(notificationRepository);
const notificationController = new NotificationController(notificationService);

router.get("/count", hasToken.adminHasToken, catchAsync(notificationController.getAdminNotificationsCount.bind(notificationController)));
router.get("/:page", hasToken.adminHasToken, catchAsync(notificationController.getAdminNotifications.bind(notificationController)));
router.patch(
    "/:id/mark-read",
    hasToken.adminHasToken,
    catchAsync(notificationController.markAdminNotificationRead.bind(notificationController))
);

module.exports = router;
