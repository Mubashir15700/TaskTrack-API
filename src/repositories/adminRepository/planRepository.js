const Plan = require("../../models/subscriptionModel");

class PlanRepository {
    async searchPlans(searchWith) {
        try {
            // return await Plan.find();
        } catch (error) {
            console.error(error);
            throw new Error("Error while searching plans");
        }
    };

};

module.exports = new PlanRepository();
