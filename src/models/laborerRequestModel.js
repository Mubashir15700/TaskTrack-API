const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    languages: {
        type: String,
        required: true
    },
    education: {
        type: String,
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
    }
});

const request = mongoose.model("request", requestSchema);

module.exports = request;
