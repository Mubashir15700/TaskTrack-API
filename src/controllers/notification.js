const sendResponse = require("../utils/responseStructure");

class NotificationController {
    constructor(notificationService) {
        this.notificationService = notificationService;
    };

    // Admin notifications
    async getAdminNotificationsCount(req, res) {
        const result = await this.notificationService.getAdminNotificationsCount();
        sendResponse(res, result);
    };

    async getAdminNotifications(req, res) {
        const { page } = req.params;
        const result = await this.notificationService.getAdminNotifications(page);
        sendResponse(res, result);
    };

    async getAdminNotification(req, res) {
        const { id } = req.params;
        const result = await this.notificationService.getAdminNotification(id);
        sendResponse(res, result);
    };

    async markAdminNotificationRead(req, res) {
        const { id } = req.params;
        const result = await this.notificationService.markAdminNotificationRead(id);
        sendResponse(res, result);
    };

    // User notifications
    async getUserNotificationsCount(req, res) {
        const { id } = req.params;
        const result = await this.notificationService.getUserNotificationsCount(id);
        sendResponse(res, result);
    };

    async getUserNotifications(req, res) {
        const { id, page } = req.params;
        const result = await this.notificationService.getUserNotifications(id, page);
        sendResponse(res, result);
    };

    async getUserNotification(req, res) {
        const { id } = req.params;
        const result = await this.notificationService.getUserNotification(id);
        sendResponse(res, result);
    };

    async markUserNotificationRead(req, res) {
        const { id } = req.params;
        const result = await this.notificationService.markUserNotificationRead(id);
        sendResponse(res, result);
    };
};

module.exports = NotificationController;
