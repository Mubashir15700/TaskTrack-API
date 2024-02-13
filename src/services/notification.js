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
            return serverErrorHandler("An error occurred during fetching admin notifications count: ", error);
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
            return serverErrorHandler("An error occurred during fetching admin notifications: ", error);
        }
    };

    // async getAdminNotification(id) {
    //     try {
    //         const notification = await notificationRepository.getAdminNotification(id);
    //         return {
    //             status: 200,
    //             message: "Get admin notification success",
    //             data: {
    //                 notification
    //             }
    //         };
    //     } catch (error) {
    //         return serverErrorHandler("An error occurred during fetching admin notification: ", error);
    //     }
    // };

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
            return serverErrorHandler("An error occurred during marking admin notification read: ", error);
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
            return serverErrorHandler("An error occurred during fetching user notifications count: ", error);
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
            return serverErrorHandler("An error occurred during fetching user notifications: ", error);
        }
    };

    // async getUserNotification(id) {
    //     try {
    //         const notification = await notificationRepository.getUserNotification(id);

    //         return {
    //             status: 200,
    //             message: "Get user notification success",
    //             data: {
    //                 notification
    //             }
    //         };
    //     } catch (error) {
    //         return serverErrorHandler("An error occurred during fetching user notification: ", error);
    //     }
    // };

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
            return serverErrorHandler("An error occurred during marking user notification read: ", error);
        }
    };

};

module.exports = new NotificationService();
