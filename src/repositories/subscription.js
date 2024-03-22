const Subscription = require("../models/subscription");

class SubscriptionRepository {
    async saveSubscription(userId, subscriptionId, planId) {
        const filter = { subscriptionId };
        const update = { userId, planId };
        const options = { upsert: true, new: true };

        const result = await Subscription.findOneAndUpdate(filter, update, options);

        if (result) {
            return result._id;
        } else {
            throw new Error("Failed to save or update subscription");
        }
    };

    async findSubscriptionsCount() {
        return await Subscription.countDocuments();
    };

    async getSubscriptions(startIndex, itemsPerPage) {
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

        return await Subscription.aggregate(aggregationPipeline);
    };

    async getActivePlan(subscriptionId) {
        return await Subscription.findById(subscriptionId).populate("planId");
    };

    async updateJobPostsCount(userId) {
        return await Subscription.findOneAndUpdate({ userId },
            { $inc: { jobPostsCount: 1 } },
        );
    };

    async postedJobsCount(userId) {
        const subscription = await Subscription.findOne({ userId });
        return subscription?.jobPostsCount;
    };

    async totalJobPostsCount(userId) {
        const totalPosts = await Subscription.findOne({ userId }).populate("planId");
        return totalPosts?.planId?.numberOfJobPosts;
    };

    async getMonthlySubscriptions() {
        // Get the start and end dates of the current year
        const currentYear = new Date().getFullYear();
        const currentYearStart = new Date(currentYear, 0, 1); // January 1st of the current year
        const currentYearEnd = new Date(currentYear, 11, 31, 23, 59, 59); // December 31st of the current year

        return await Subscription.aggregate([
            {
                $match: {
                    // Filter documents where createdAt is within the current year
                    createdAt: {
                        $gte: currentYearStart, // Start of current year
                        $lte: currentYearEnd // End of current year
                    }
                }
            },
            {
                $project: {
                    year: { $year: "$createdAt" }, // Extract year from createdAt
                    month: { $month: "$createdAt" } // Extract month from createdAt
                }
            },
            {
                $group: {
                    _id: { year: "$year", month: "$month" }, // Group by year and month
                    totalSubscriptions: { $sum: 1 } // Count subscriptions
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 } // Optionally sort by year and month
            }
        ]);
    };
};

module.exports = SubscriptionRepository;
