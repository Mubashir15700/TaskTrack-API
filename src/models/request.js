const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    languages: {
        type: [String],
        required: true
    },
    education: {
        type: [String],
        required: true
    },
    avlDays: {
        type: [String],
        required: true
    },
    avlTimes: {
        type: [String],
        required: true
    },
    fields: [{
        name: String,
        worksDone: Number,
        wagePerHour: Number
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected", "cancelled"],
        default: "pending",
    },
});

const Request = mongoose.model("Request", RequestSchema);

module.exports = Request;
