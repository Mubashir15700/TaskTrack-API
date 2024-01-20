const planRepository = require("../../repositories/admin/plan");

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

            if (!plans.length) {
                return { status: 400, message: "No plans found" };
            }

            const totalPlans = await planRepository.findPlansCount();
            const totalPages = Math.ceil(totalPlans / itemsPerPage);

            return {
                status: 201,
                message: "Found plans",
                data: {
                    plans,
                    totalPages
                }
            };
        } catch (error) {
            console.log(error);
            return {
                status: 500, message: `Internal Server Error: ${error.message}`
            };
        }
    };

    async addPlan(name, description, type, number, amount) {
        try {
            if (!name || !description || !type || !number || !amount) {
                return { status: 400, message: "All fields (name, description, type, number, amount) are required" };
            }

            // Check if a plan with the same name already exists
            const planExists = await this.checkPlanExistsByName(name);
            if (planExists) {
                return { status: 400, message: "A plan with the same name already exists" };
            }

            await planRepository.addPlan(name, description, type, number, amount);

            return {
                status: 201,
                message: "Plan added success",
            };
        } catch (error) {
            console.log(error);
            return {
                status: 500, message: `Internal Server Error: ${error.message}`
            };
        }
    };

    async listUnlistPlan(id) {
        try {
            const updatedPlan = await planRepository.listUnlistPlan(id);

            if (!updatedPlan) {
                return { status: 400, message: "No plan found" };
            }

            return {
                status: 201,
                message: "Updated plan"
            };
        } catch (error) {
            console.log(error);
            return {
                status: 500, message: `Internal Server Error: ${error.message}`
            };
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
            console.log(error);
            return {
                status: 500, message: `Internal Server Error: ${error.message}`
            };
        }
    };

    async editPlan(id, name, description, type, number, amount) {
        try {
            if (!name || !description || !type || !number || !amount) {
                return { status: 400, message: "All fields (name, description, type, number, amount) are required" };
            }

            // Check if a plan with the same name already exists
            const planExists = await this.checkPlanExistsByName(name, id);
            if (planExists) {
                return { status: 400, message: "A plan with the same name already exists" };
            }

            await planRepository.editPlan(id, name, description, type, number, amount);

            return {
                status: 201,
                message: "Plan edited success",
            };
        } catch (error) {
            console.log(error);
            return {
                status: 500, message: `Internal Server Error: ${error.message}`
            };
        }
    };
};

module.exports = new PlanService();
