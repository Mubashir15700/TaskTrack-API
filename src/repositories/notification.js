const Notification = require("../models/notification");
const repositoryErrorHandler = require("../utils/errorHandling/repositoryErrorHandler");

class NotificationRepository {
    async saveNewNotification(notification) {
        try {
            const newNotification = new Notification({ ...notification });
            await newNotification.save();
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };

    // admin
    async getAdminNotificationsCount() {
        try {
            return await Notification.countDocuments({ to: "admin", isViewed: false });
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };

    async getAllAdminNotificationsCount() {
        try {
            return await Notification.countDocuments({ to: "admin" });
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };

    async getAdminNotifications(page, pageSize) {
        try {
            await Notification.updateMany({ to: "admin" }, { $set: { isViewed: true } });
            const updatedNotifications = await Notification.find({ to: "admin" })
                .populate("from")
                .sort({ timestamp: -1 })
                .skip((page - 1) * pageSize)
                .limit(pageSize);
            return updatedNotifications;
        } catch (error) {
            repositoryErrorHandler(error);
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
            repositoryErrorHandler(error);
        }
    };

    // user
    async getUserNotificationsCount(userId) {
        try {
            return await Notification.countDocuments({ to: userId, isViewed: false });
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };

    async getAllUserNotificationsCount(userId) {
        try {
            return await Notification.countDocuments({ to: userId });
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };

    async getUserNotifications(userId, page, pageSize) {
        try {
            await Notification.updateMany({ to: userId }, { $set: { isViewed: true } });
            const updatedNotifications = await Notification.find({ to: userId })
                .populate("from")
                .sort({ timestamp: -1 })
                .skip((page - 1) * pageSize)
                .limit(pageSize);
            return updatedNotifications;
        } catch (error) {
            repositoryErrorHandler(error);
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
            repositoryErrorHandler(error);
        }
    };
};

module.exports = new NotificationRepository();
