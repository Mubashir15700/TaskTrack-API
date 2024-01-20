const Notification = require("../models/notification");

class NotificationRepository {
    // admin
    async getAdminNotificationsCount() {
        try {
            return await Notification.countDocuments({ to: "admin", isViewed: false });
        } catch (error) {
            console.error(error);
            throw new Error("Error while fetching admin notifications count");
        }
    };

    async getAdminNotifications() {
        try {
            await Notification.updateMany({ to: "admin" }, { $set: { isViewed: true } });
            const updatedNotifications = await Notification.find({ to: "admin" }).populate("from").sort({ isOpened: 1 });
            return updatedNotifications;
        } catch (error) {
            console.error(error);
            throw new Error("Error while fetching admin notifications");
        }
    };

    async markAdminNotificationRead(id) {
        try {
            return await Notification.findByIdAndUpdate(
                id,
                { $set: { isViewed: true, isOpened: true } },
                { new: true }
            );
        } catch (error) {
            console.error(error);
            throw new Error("Error while updating notification");
        }
    };

    // user
    async getUserNotificationsCount(userId) {
        try {
            return await Notification.countDocuments({ to: userId, isViewed: false });
        } catch (error) {
            console.error(error);
            throw new Error("Error while fetching user notifications count");
        }
    };

    async getUserNotifications(userId) {
        try {
            await Notification.updateMany({ to: userId }, { $set: { isViewed: true } });
            const updatedNotifications = await Notification.find(
                { to: userId }
            ).populate("from").sort({ isOpened: 1 });
            return updatedNotifications;
        } catch (error) {
            console.error(error);
            throw new Error("Error while fetching user notifications");
        }
    };

    async markUserNotificationRead(id) {
        try {
            return await Notification.findByIdAndUpdate(
                id,
                { $set: { isViewed: true, isOpened: true } },
                { new: true }
            );
        } catch (error) {
            console.error(error);
            throw new Error("Error while updating notification");
        }
    };
};

module.exports = new NotificationRepository();
