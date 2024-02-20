const notificationRepository = require("../repositories/notification");
const serverErrorHandler = require("../utils/errorHandling/serverErrorHandler");

class NotificationService {
    // admin
    async getAdminNotificationsCount() {
        try {
            const count = await notificationRepository.getAdminNotificationsCount();
            return {
                status: 200,
                message: "Get new admin notifications count success",
                data: {
                    count
                }
            };
        } catch (error) {
            return serverErrorHandler(error.message);
        }
    };

    async getAdminNotifications(page) {
        try {
            const pageSize = 10;

            const notifications = await notificationRepository.getAdminNotifications(
                page, pageSize
            );

            const totalNotifications = await notificationRepository.getAdminNotificationsCount();
            const totalPages = Math.ceil(totalNotifications / pageSize);

            return {
                status: 200,
                message: "Get admin notifications success",
                data: {
                    notifications,
                    totalPages
                }
            };
        } catch (error) {
            return serverErrorHandler(error.message);
        }
    };

    async markAdminNotificationRead(id) {
        try {
            const result = await notificationRepository.markAdminNotificationRead(id);

            if (result) {
                return {
                    status: 200,
                    message: "Mark notification read success",
                };
            }
        } catch (error) {
            return serverErrorHandler(error.message);
        }
    };

    // user
    async getUserNotificationsCount(userId) {
        try {
            const count = await notificationRepository.getUserNotificationsCount(userId);

            return {
                status: 200,
                message: "Get new user notifications count success",
                data: {
                    count
                }
            };
        } catch (error) {
            return serverErrorHandler(error.message);
        }
    };

    async getUserNotifications(userId, page) {
        try {
            const pageSize = 10;

            const notifications = await notificationRepository.getUserNotifications(
                userId, page, pageSize
            );

            const totalNotifications = await notificationRepository.getAllUserNotificationsCount(userId);
            const totalPages = Math.ceil(totalNotifications / pageSize);

            return {
                status: 200,
                message: "Get user notifications success",
                data: {
                    notifications,
                    totalPages
                }
            };
        } catch (error) {
            return serverErrorHandler(error.message);
        }
    };

    async markUserNotificationRead(id) {
        try {
            const result = await notificationRepository.markUserNotificationRead(id);

            if (result) {
                return {
                    status: 200,
                    message: "Mark notification read success",
                };
            }
        } catch (error) {
            return serverErrorHandler(error.message);
        }
    };

};

module.exports = new NotificationService();
