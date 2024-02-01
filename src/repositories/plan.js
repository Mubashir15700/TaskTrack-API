const Plan = require("../models/plan");
const Subscription = require("../models/subscription");

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

    async saveSubscription(userId, subscriptionId, planId) {
        try {
            const filter = { subscriptionId };
            const update = { userId, planId };
            const options = { upsert: true, new: true };

            const result = await Subscription.findOneAndUpdate(filter, update, options);

            if (result) {
                return result._id;
            } else {
                throw new Error("Failed to save or update subscription");
            }
        } catch (error) {
            console.log(error);
            throw new Error("Error while saving or updating subscription");
        }
    };

    async findSubscriptionsCount() {
        try {
            return await Subscription.countDocuments();
        } catch (error) {
            console.log(error);
            throw new Error("Error while fetching subscriptions count");
        }
    };

    async getSubscriptions(startIndex, itemsPerPage) {
        try {
            const aggregationPipeline = [
                { $skip: startIndex || 0 },
                { $limit: itemsPerPage || 0 },
                {
                    $lookup: {
                        from: "plans",  // Assuming the name of the "plans" collection
                        localField: "planId",
                        foreignField: "_id",
                        as: "Plan"
                    }
                },
                {
                    $lookup: {
                        from: "users",  // Assuming the name of the "users" collection
                        localField: "userId",
                        foreignField: "_id",
                        as: "User"
                    }
                },
                {
                    $unwind: "$Plan" // Unwind the "Plan" array
                },
                {
                    $unwind: "$User" // Unwind the "User" array
                },
                {
                    $project: {
                        subscriptionId: 1,
                        createdAt: 1,
                        isActive: 1,
                        planName: "$Plan.name",
                        amount: "$Plan.amount",
                        type: "$Plan.type",
                        username: "$User.username",
                    }
                }
            ];

            const res = await Subscription.aggregate(aggregationPipeline);

            return res;
        } catch (error) {
            console.log(error);
            throw new Error("Error while fetching subscriptions");
        }
    };

    async getActivePlan(subscriptionId) {
        try {
            return await Subscription.findById(subscriptionId).populate("planId")
        } catch (error) {
            console.log(error);
            throw new Error("Error while fetching active plan");
        }
    };

    async cancelSubscription(subscriptionId) {
        try {
            const filter = { subscriptionId };

            return await Subscription.findOneAndDelete(filter);
        } catch (error) {
            console.log(error);
            throw new Error("Error while saving or updating subscription");
        }
    };
};

module.exports = new PlanRepository();
