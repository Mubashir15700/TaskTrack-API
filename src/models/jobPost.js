const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    postedAt: {
        type: Date,
        default: Date.now,
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    location: {
        lat: Number,
        lon: Number,
        road: String,
        village: String,
        district: String,
        state: String,
        postcode: String
    },
    fields: [{
        name: String,
        workers: Number,
        materialsRequired: String,
        wagePerHour: Number,
        applicants: [{
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            status: {
                type: String,
                enum: ["accepted", "rejected", "pending"],
                default: "pending",
            }
        }]
    }],
    status: {
        type: String,
        enum: ["open", "in progress", "completed", "closed"],
        default: "open",
    },
});

const Job = mongoose.model("Job", JobSchema);

module.exports = Job;
