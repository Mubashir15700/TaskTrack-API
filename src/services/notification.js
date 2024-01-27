const notificationRepository = require("../repositories/notification");
const serverErrorHandler = require("../utils/serverErrorHandler");

class NotificationService {
    // admin
    async getAdminNotificationsCount() {
        try {
            const count = await notificationRepository.getAdminNotificationsCount();
            return {
                status: 201,
                message: "Get new admin notifications count success",
                data: {
                    count
                }
            };
        } catch (error) {
            return serverErrorHandler("An error occurred during fetching admin notifications count: ", error);
        }
    };

    async getAdminNotifications() {
        try {
            const notifications = await notificationRepository.getAdminNotifications();
            return {
                status: 201,
                message: "Get admin notifications success",
                data: {
                    notifications
                }
            };
        } catch (error) {
            return serverErrorHandler("An error occurred during fetching admin notifications: ", error);
        }
    };

    async getAdminNotification(id) {
        try {
            const notification = await notificationRepository.getAdminNotification(id);
            return {
                status: 201,
                message: "Get admin notification success",
                data: {
                    notification
                }
            };
        } catch (error) {
            return serverErrorHandler("An error occurred during fetching admin notification: ", error);
        }
    };

    async markAdminNotificationRead(id) {
        try {
            const result = await notificationRepository.markAdminNotificationRead(id);

            if (result) {
                return {
                    status: 201,
                    message: "Mark notification read success",
                };
            }
        } catch (error) {
            return serverErrorHandler("An error occurred during marking admin notification read: ", error);
        }
    };

    // user
    async getUserNotificationsCount(userId) {
        try {
            const count = await notificationRepository.getUserNotificationsCount(userId);

            return {
                status: 201,
                message: "Get new user notifications count success",
                data: {
                    count
                }
            };
        } catch (error) {
            return serverErrorHandler("An error occurred during fetching user notifications count: ", error);
        }
    };

    async getUserNotifications(userId) {
        try {
            const notifications = await notificationRepository.getUserNotifications(userId);
            return {
                status: 201,
                message: "Get user notifications success",
                data: {
                    notifications
                }
            };
        } catch (error) {
            return serverErrorHandler("An error occurred during fetching user notifications: ", error);
        }
    };

    async getUserNotification(id) {
        try {
            const notification = await notificationRepository.getUserNotification(id);

            return {
                status: 201,
                message: "Get user notification success",
                data: {
                    notification
                }
            };
        } catch (error) {
            return serverErrorHandler("An error occurred during fetching user notification: ", error);
        }
    };

    async markUserNotificationRead(id) {
        try {
            const result = await notificationRepository.markUserNotificationRead(id);

            if (result) {
                return {
                    status: 201,
                    message: "Mark notification read success",
                };
            }
        } catch (error) {
            return serverErrorHandler("An error occurred during marking user notification read: ", error);
        }
    };

};

module.exports = new NotificationService();
