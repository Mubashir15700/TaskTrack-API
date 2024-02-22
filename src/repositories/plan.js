const Plan = require("../models/plan");
const repositoryErrorHandler = require("../utils/errorHandling/repositoryErrorHandler");

class PlanRepository {
    async checkPlanExistsByName(query) {
        try {
            return await Plan.findOne(query);
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };

    async findPlansCount() {
        try {
            return await Plan.countDocuments();
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };

    async getPlans(startIndex, itemsPerPage) {
        try {
            let query = Plan.find();

            if (startIndex !== undefined) {
                query = query.skip(startIndex);
            }

            if (itemsPerPage !== undefined) {
                query = query.limit(itemsPerPage);
            }

            return await query.exec();
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };

    async addPlan(name, description, type, numberOfJobPosts, amount) {
        try {
            await Plan.create({ name, description, type, numberOfJobPosts, amount });
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };

    async searchPlans(searchWith) {
        try {
            const searchResults = await Plan.find({
                $or: [
                    { name: { $regex: searchWith, $options: "i" } },
                    { description: { $regex: searchWith, $options: "i" } },
                ],
            });
            return searchResults;
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };

    async listUnlistPlan(id) {
        try {
            const plan = await Plan.findById(id);
            const activeState = plan.isActive;

            return await Plan.findByIdAndUpdate(id, {
                $set: { isActive: !activeState },
            });
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };

    async getPlan(id) {
        try {
            return await Plan.findById(id);
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };

    async editPlan(id, name, description, type, numberOfJobPosts, amount) {
        try {
            await Plan.findByIdAndUpdate(id,
                { name, description, type, numberOfJobPosts, amount },
                { new: true }
            );
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };

    async getActivePlans() {
        try {
            return await Plan.find({ isActive: true });
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };
};

module.exports = new PlanRepository();
