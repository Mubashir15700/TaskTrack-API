const notificationRepository = require("../repositories/notificationRepository");

class NotificationService {
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
};

module.exports = new NotificationService();
