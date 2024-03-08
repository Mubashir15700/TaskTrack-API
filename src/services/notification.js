class NotificationService {
    constructor (notificationRepository) {
        this.notificationRepository = notificationRepository;
    };

    // admin
    async getAdminNotificationsCount() {
        const count = await this.notificationRepository.getAdminNotificationsCount();
        return {
            status: 200,
            message: "Get new admin notifications count success",
            data: {
                count
            }
        };
    };

    async getAdminNotifications(page) {
        const pageSize = 10;

        const notifications = await this.notificationRepository.getAdminNotifications(
            page, pageSize
        );

        const totalNotifications = await this.notificationRepository.getAdminNotificationsCount();
        const totalPages = Math.ceil(totalNotifications / pageSize);

        return {
            status: 200,
            message: "Get admin notifications success",
            data: {
                notifications,
                totalPages
            }
        };
    };

    async markAdminNotificationRead(id) {
        const result = await this.notificationRepository.markAdminNotificationRead(id);

        if (result) {
            return {
                status: 200,
                message: "Mark notification read success",
            };
        }
    };

    // user
    async getUserNotificationsCount(userId) {
        const count = await this.notificationRepository.getUserNotificationsCount(userId);

        return {
            status: 200,
            message: "Get new user notifications count success",
            data: {
                count
            }
        };
    };

    async getUserNotifications(userId, page) {
        const pageSize = 10;

        const notifications = await this.notificationRepository.getUserNotifications(
            userId, page, pageSize
        );

        const totalNotifications = await this.notificationRepository.getAllUserNotificationsCount(userId);
        const totalPages = Math.ceil(totalNotifications / pageSize);

        return {
            status: 200,
            message: "Get user notifications success",
            data: {
                notifications,
                totalPages
            }
        };
    };

    async markUserNotificationRead(id) {
        const result = await this.notificationRepository.markUserNotificationRead(id);

        if (result) {
            return {
                status: 200,
                message: "Mark notification read success",
            };
        }
    };
};

module.exports = NotificationService;
