class PlanService {
    constructor(planRepository) {
        this.planRepository = planRepository;
    };

    async getPlans() {
        const plans = await this.planRepository.getActivePlans();

        if (!plans.length) {
            return { status: 404, message: "No available plans found" };
        }

        return {
            status: 200,
            message: "Found plans",
            data: {
                plans
            }
        };
    };


    async getPlan(id) {
        const plan = await this.planRepository.getPlan(id);

        if (!plan) {
            return { status: 404, message: "No plan found" };
        }

        return {
            status: 200,
            message: "Found plan",
            data: {
                plan
            }
        };
    };
};

module.exports = PlanService;
