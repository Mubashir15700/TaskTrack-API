const planRepository = require("../../repositories/plan");
const serverErrorHandler = require("../../utils/serverErrorHandler");

class PlanService {
    async getPlans() {
        try {
            const plans = await planRepository.getPlans();

            if (!plans.length) {
                return { status: 400, message: "No plans found" };
            }

            return {
                status: 201,
                message: "Found plans",
                data: {
                    plans
                }
            };
        } catch (error) {
            return serverErrorHandler("An error occurred during fetching plans: ", error);
        }
    };

    async getPlan(id) {
        try {
            const plan = await planRepository.getPlan(id);

            if (!plan) {
                return { status: 400, message: "No plan found" };
            }

            return {
                status: 201,
                message: "Found plan",
                data: {
                    plan
                }
            };
        } catch (error) {
            return serverErrorHandler("An error occurred during fetching plan: ", error);
        }
    };

};

module.exports = new PlanService();
