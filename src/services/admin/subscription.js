class SubscriptionService {
    constructor (subscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    };

    async getSubscriptions(itemsPerPage, currentPage) {
        const startIndex = (currentPage) * itemsPerPage;
        const subscriptions = await this.subscriptionRepository.getSubscriptions(startIndex, itemsPerPage);
        const totalSubscriptions = await this.subscriptionRepository.findSubscriptionsCount();
        const totalPages = Math.ceil(totalSubscriptions / itemsPerPage);

        return {
            status: 200,
            message: "Found subscriptions",
            data: {
                subscriptions,
                totalPages
            }
        };
    };
};

module.exports = SubscriptionService;