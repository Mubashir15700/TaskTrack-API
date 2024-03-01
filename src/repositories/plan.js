const Plan = require("../models/plan");

class PlanRepository {
    async checkPlanExistsByName(query) {
        return await Plan.findOne(query);
    };

    async findPlansCount() {
        return await Plan.countDocuments();
    };

    async getPlans(startIndex, itemsPerPage) {
        let query = Plan.find();

        if (startIndex !== undefined) {
            query = query.skip(startIndex);
        }

        if (itemsPerPage !== undefined) {
            query = query.limit(itemsPerPage);
        }

        return await query.exec();
    };

    async addPlan(name, description, type, numberOfJobPosts, amount) {
        await Plan.create({ name, description, type, numberOfJobPosts, amount });
    };

    async searchPlans(searchWith) {
        return await Plan.find({
            $or: [
                { name: { $regex: searchWith, $options: "i" } },
                { description: { $regex: searchWith, $options: "i" } },
            ],
        });
    };

    async listUnlistPlan(id) {
        const plan = await Plan.findById(id);
        const activeState = plan.isActive;

        return await Plan.findByIdAndUpdate(id, {
            $set: { isActive: !activeState },
        });
    };

    async getPlan(id) {
        return await Plan.findById(id);
    };

    async editPlan(id, name, description, type, numberOfJobPosts, amount) {
        await Plan.findByIdAndUpdate(id,
            { name, description, type, numberOfJobPosts, amount },
            { new: true }
        );
    };

    async getActivePlans() {
        return await Plan.find({ isActive: true });
    };
};

module.exports = PlanRepository;
