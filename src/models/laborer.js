const mongoose = require("mongoose");

const LaborerSchema = new mongoose.Schema({
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
});

const Laborer = mongoose.model("Laborer", LaborerSchema);

module.exports = Laborer;
