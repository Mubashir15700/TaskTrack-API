const Plan = require("../models/plan");

class PlanRepository {
    async checkPlanExistsByName(query) {
        try {
            return await Plan.findOne(query);
        } catch (error) {
            console.log(error);
            throw new Error("Error while finding plan");
        }
    };

    async findPlansCount() {
        try {
            return await Plan.countDocuments();
        } catch (error) {
            console.log(error);
            throw new Error("Error while finding plans count");
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
            console.log(error);
            throw new Error("Error while fetching plans");
        }
    };

    async addPlan(name, description, type, numberOfJobPosts, amount) {
        try {
            await Plan.create({ name, description, type, numberOfJobPosts, amount });
        } catch (error) {
            console.log(error);
            throw new Error("Error while adding plan");
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
            console.error(error);
            throw new Error("Error while searching plans");
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
            console.log(error);
            throw new Error("Error while updating plan");
        }
    };

    async getPlan(id) {
        try {
            return await Plan.findById(id);
        } catch (error) {
            console.log(error);
            throw new Error("Error while finding plan");
        }
    };

    async editPlan(id, name, description, type, numberOfJobPosts, amount) {
        try {
            await Plan.findByIdAndUpdate(id,
                { name, description, type, numberOfJobPosts, amount },
                { new: true }
            );
        } catch (error) {
            console.log(error);
            throw new Error("Error while editing plan");
        }
    };
};

module.exports = new PlanRepository();
