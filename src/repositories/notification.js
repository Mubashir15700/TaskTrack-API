const Notification = require("../models/notification");

class NotificationRepository {
    async saveNewNotification(notification) {
        const newNotification = new Notification({ ...notification });
        await newNotification.save();
    };

    // admin
    async getAdminNotificationsCount() {
        return await Notification.countDocuments({ to: "admin", isViewed: false });
    };

    async getAllAdminNotificationsCount() {
        return await Notification.countDocuments({ to: "admin" });
    };

    async getAdminNotifications(page, pageSize) {
        await Notification.updateMany({ to: "admin" }, { $set: { isViewed: true } });
        const updatedNotifications = await Notification.find({ to: "admin" })
            .populate("from")
            .sort({ timestamp: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);
        return updatedNotifications;
    };

    async markAdminNotificationRead(id) {
        return await Notification.findByIdAndUpdate(id,
            { $set: { isViewed: true, isOpened: true } },
            { new: true }
        );
    };

    // user
    async getUserNotificationsCount(userId) {
        return await Notification.countDocuments({ to: userId, isViewed: false });
    };

    async getAllUserNotificationsCount(userId) {
        return await Notification.countDocuments({ to: userId });
    };

    async getUserNotifications(userId, page, pageSize) {
        await Notification.updateMany({ to: userId }, { $set: { isViewed: true } });
        const updatedNotifications = await Notification.find({ to: userId })
            .populate("from")
            .sort({ timestamp: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);
        return updatedNotifications;
    };

    async markUserNotificationRead(id) {
        return await Notification.findByIdAndUpdate(
            id,
            { $set: { isViewed: true, isOpened: true } },
            { new: true }
        );
    };
};

module.exports = NotificationRepository;
