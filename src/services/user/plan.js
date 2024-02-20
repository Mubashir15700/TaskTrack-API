const planRepository = require("../../repositories/plan");
const serverErrorHandler = require("../../utils/errorHandling/serverErrorHandler");

class PlanService {
    async getPlans() {
        try {
            const plans = await planRepository.getActivePlans();

            if (!plans.length) {
                throw new Error("No available plans found");
            }

            return {
                status: 200,
                message: "Found plans",
                data: {
                    plans
                }
            };
        } catch (error) {
            return serverErrorHandler(error.message);
        }
    };

    async getPlan(id) {
        try {
            const plan = await planRepository.getPlan(id);

            if (!plan) {
                throw new Error("No plan found");
            }

            return {
                status: 200,
                message: "Found plan",
                data: {
                    plan
                }
            };
        } catch (error) {
            return serverErrorHandler(error.message);
        }
    };
};

module.exports = new PlanService();
