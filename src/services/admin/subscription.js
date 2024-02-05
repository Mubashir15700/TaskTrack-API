const subscriptionRepository = require("../../repositories/subscription");
const serverErrorHandler = require("../../utils/errorHandling/serverErrorHandler");

class PlanService {
    async getSubscriptions(itemsPerPage, currentPage) {
        try {
            const startIndex = (currentPage) * itemsPerPage;
            const subscriptions = await subscriptionRepository.getSubscriptions(startIndex, itemsPerPage);

            if (!subscriptions.length) {
                return { status: 400, message: "No subscriptions found" };
            }

            const totalSubscriptions = await subscriptionRepository.findSubscriptionsCount();
            const totalPages = Math.ceil(totalSubscriptions / itemsPerPage);

            return {
                status: 201,
                message: "Found subscriptions",
                data: {
                    subscriptions,
                    totalPages
                }
            };
        } catch (error) {
            return serverErrorHandler("An error occurred during fetching subscriptions: ", error);
        }
    };
};

module.exports = new PlanService();