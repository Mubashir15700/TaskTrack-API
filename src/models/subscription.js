const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema({
    planId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Plan", 
        required: true 
    },
    createdDate: { 
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
