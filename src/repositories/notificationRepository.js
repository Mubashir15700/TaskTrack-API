const Notification = require("../models/notificationModel");

class NotificationRepository {
    async getAdminNotificationsCount() {
        try {
            return await Notification.countDocuments({ to: "admin", isOpend: false });
        } catch (error) {
            console.error(error);
            throw new Error("Error while fetching admin notifications count");
        }
    };

    async getUserNotificationsCount(id) {
        try {
            return await Notification.countDocuments({ to: id, isOpend: false });
        } catch (error) {
            console.error(error);
            throw new Error("Error while fetching user notifications count");
        }
    };
};

module.exports = new NotificationRepository();
