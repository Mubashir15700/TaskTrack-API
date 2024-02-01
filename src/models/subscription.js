const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    subscriptionId: {
        type: String,
        required: true
    },
    planId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plan",
        required: true
    },
    jobPostsCount: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    },
});

const Subscription = mongoose.model("Subscription", SubscriptionSchema);

module.exports = Subscription;
