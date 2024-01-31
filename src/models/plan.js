const mongoose = require("mongoose");

const PlanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
    },
    numberOfJobPosts: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true,
    }
});

const Plan = mongoose.model("Plan", PlanSchema);

module.exports = Plan;
