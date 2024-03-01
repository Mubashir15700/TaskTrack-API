class PlanService {
    constructor (planRepository) {
        this.planRepository = planRepository;
    };

    async checkPlanExistsByName(name, id = null) {
        // Build the query
        const query = { name };
        if (id) {
            query._id = { $ne: id }; // Exclude the specified id
        }
        const planExists = await this.planRepository.checkPlanExistsByName(query);
        if (planExists) {
            return true;
        }
        return false;
    };

    async getPlans(itemsPerPage, currentPage) {
        const startIndex = (currentPage) * itemsPerPage;
        const plans = await this.planRepository.getPlans(startIndex, itemsPerPage);
        const totalPlans = await this.planRepository.findPlansCount();
        const totalPages = Math.ceil(totalPlans / itemsPerPage);

        return {
            status: 200,
            message: "Found plans",
            data: {
                plans,
                totalPages
            }
        };
    };

    async addPlan(name, description, type, numberOfJobPosts, amount) {
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

        await this.planRepository.addPlan(name, description, type, numberOfJobPosts, amount);

        return {
            status: 200,
            message: "Plan added success",
        };
    };

    async listUnlistPlan(id) {
        const updatedPlan = await this.planRepository.listUnlistPlan(id);

        if (!updatedPlan) {
            throw new Error("No plan found");
        }

        return {
            status: 200,
            message: "Updated plan"
        };
    };

    async getPlan(id) {
        const plan = await this.planRepository.getPlan(id);

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
    };

    async editPlan(id, name, description, type, numberOfJobPosts, amount) {
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

        await this.planRepository.editPlan(id, name, description, type, numberOfJobPosts, amount);

        return {
            status: 200,
            message: "Plan edited success",
        };
    };
};

module.exports = PlanService;
