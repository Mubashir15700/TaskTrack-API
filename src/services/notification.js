const notificationRepository = require("../repositories/notification");

class NotificationService {
    // admin
    async getAdminNotificationsCount() {
        try {
            const count = await notificationRepository.getAdminNotificationsCount();

            return {
                status: 201,
                message: "get new admin notifiations count success",
                data: {
                    count
                }
            };
        } catch (error) {
            console.log(error);
            return {
                status: 500, message: `Internal Server Error: ${error.message}`
            };
        }
    };

    async getAdminNotifications() {
        try {
            const notifications = await notificationRepository.getAdminNotifications();
            return {
                status: 201,
                message: "get admin notifiations success",
                data: {
                    notifications
                }
            };
        } catch (error) {
            console.log(error);
            return {
                status: 500, message: `Internal Server Error: ${error.message}`
            };
        }
    };

    async getAdminNotification(id) {
        try {
            const notification = await notificationRepository.getAdminNotification(id);
            return {
                status: 201,
                message: "get admin notifiation success",
                data: {
                    notification
                }
            };
        } catch (error) {
            console.log(error);
            return {
                status: 500, message: `Internal Server Error: ${error.message}`
            };
        }
    };

    async markAdminNotificationRead(id) {
        try {
            const result = await notificationRepository.markAdminNotificationRead(id);

            if (result) {
                return {
                    status: 201,
                    message: "mark notifiation read success",
                };
            }
        } catch (error) {
            console.log(error);
            return {
                status: 500, message: `Internal Server Error: ${error.message}`
            };
        }
    };

    // user
    async getUserNotificationsCount(userId) {
        try {
            const count = await notificationRepository.getUserNotificationsCount(userId);

            return {
                status: 201,
                message: "get new user notifiations count success",
                data: {
                    count
                }
            };
        } catch (error) {
            console.log(error);
            return {
                status: 500, message: `Internal Server Error: ${error.message}`
            };
        }
    };

    async getUserNotifications(userId) {
        try {
            const notifications = await notificationRepository.getUserNotifications(userId);
            return {
                status: 201,
                message: "get user notifiations success",
                data: {
                    notifications
                }
            };
        } catch (error) {
            console.log(error);
            return {
                status: 500, message: `Internal Server Error: ${error.message}`
            };
        }
    };

    async getUserNotification(id) {
        try {
            const notifiation = await notificationRepository.getUserNotification(id);

            return {
                status: 201,
                message: "get user notifiation success",
                data: {
                    notifiation
                }
            };
        } catch (error) {
            console.log(error);
            return {
                status: 500, message: `Internal Server Error: ${error.message}`
            };
        }
    };

    async markUserNotificationRead(id) {
        try {
            const result = await notificationRepository.markUserNotificationRead(id);

            if (result) {
                return {
                    status: 201,
                    message: "mark notifiation read success",
                };
            }
        } catch (error) {
            console.log(error);
            return {
                status: 500, message: `Internal Server Error: ${error.message}`
            };
        }
    };
};

module.exports = new NotificationService();
