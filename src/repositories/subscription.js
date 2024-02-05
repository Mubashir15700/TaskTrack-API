const Subscription = require("../models/subscription");

class SubscriptionRepository {
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

    async updateJobPostsCount(userId) {
        try {
            return await Subscription.findOneAndUpdate({ userId },
                { $inc: { jobPostsCount: 1 } },
            );
        } catch (error) {
            console.log(error);
            throw new Error("Error while fetching posted job's count");
        }
    };

    async postedJobsCount(userId) {
        try {
            const subscription = await Subscription.findOne({ userId });
            return subscription?.jobPostsCount;
        } catch (error) {
            console.log(error);
            throw new Error("Error while fetching posted job's count");
        }
    };

    async totalJobPostsCount(userId) {
        try {
            const totalPosts = await Subscription.findOne({ userId }).populate("planId");
            return totalPosts?.planId?.numberOfJobPosts;
        } catch (error) {
            console.log(error);
            throw new Error("Error while fetching posted job's count");
        }
    };
};

module.exports = new SubscriptionRepository();
