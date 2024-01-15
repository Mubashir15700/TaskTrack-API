const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
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
    number: {
        type: Number,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    }
});

const plan = mongoose.model("plan", planSchema);

module.exports = plan;
