const subscriptionRepository = require("../../repositories/subscription");
const serverErrorHandler = require("../../utils/errorHandling/serverErrorHandler");

class PlanService {
    async getSubscriptions(itemsPerPage, currentPage) {
        try {
            const startIndex = (currentPage) * itemsPerPage;
            const subscriptions = await subscriptionRepository.getSubscriptions(startIndex, itemsPerPage);
            const totalSubscriptions = await subscriptionRepository.findSubscriptionsCount();
            const totalPages = Math.ceil(totalSubscriptions / itemsPerPage);

            return {
                status: 200,
                message: "Found subscriptions",
                data: {
                    subscriptions,
                    totalPages
                }
            };
        } catch (error) {
            return serverErrorHandler(error.message);
        }
    };
};

module.exports = new PlanService();