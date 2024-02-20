const planRepository = require("../../repositories/plan");
const serverErrorHandler = require("../../utils/errorHandling/serverErrorHandler");

class PlanService {
    async checkPlanExistsByName(name, id = null) {
        // Build the query
        const query = { name };
        if (id) {
            query._id = { $ne: id }; // Exclude the specified id
        }
        const planExists = await planRepository.checkPlanExistsByName(query);
        if (planExists) {
            return true;
        }
        return false;
    };

    async getPlans(itemsPerPage, currentPage) {
        try {
            const startIndex = (currentPage) * itemsPerPage;
            const plans = await planRepository.getPlans(startIndex, itemsPerPage);
            const totalPlans = await planRepository.findPlansCount();
            const totalPages = Math.ceil(totalPlans / itemsPerPage);

            return {
                status: 200,
                message: "Found plans",
                data: {
                    plans,
                    totalPages
                }
            };
        } catch (error) {
            return serverErrorHandler(error.message);
        }
    };

    async addPlan(name, description, type, numberOfJobPosts, amount) {
        try {
            if (!name || !description || !type || !numberOfJobPosts || !amount) {
                throw new Error(
                    "All fields (name, description, type, number of job posts, amount) are required"
                );
            }

            // Check if a plan with the same name already exists
            const planExists = await this.checkPlanExistsByName(name);
            if (planExists) {
                throw new Error("A plan with the same name already exists");
            }

            await planRepository.addPlan(name, description, type, numberOfJobPosts, amount);

            return {
                status: 200,
                message: "Plan added success",
            };
        } catch (error) {
            return serverErrorHandler(error.message);
        }
    };

    async listUnlistPlan(id) {
        try {
            const updatedPlan = await planRepository.listUnlistPlan(id);

            if (!updatedPlan) {
                throw new Error("No plan found");
            }

            return {
                status: 200,
                message: "Updated plan"
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

    async editPlan(id, name, description, type, numberOfJobPosts, amount) {
        try {
            if (!name || !description || !type || !numberOfJobPosts || !amount) {
                throw new Error(
                    "All fields (name, description, type, number of job posts, amount) are required"
                );
            }

            // Check if a plan with the same name already exists
            const planExists = await this.checkPlanExistsByName(name, id);
            if (planExists) {
                throw new Error("A plan with the same name already exists");
            }

            await planRepository.editPlan(id, name, description, type, numberOfJobPosts, amount);

            return {
                status: 200,
                message: "Plan edited success",
            };
        } catch (error) {
            return serverErrorHandler(error.message);
        }
    };
};

module.exports = new PlanService();
