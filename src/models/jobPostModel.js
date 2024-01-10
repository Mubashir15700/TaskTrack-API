const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
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
        wagePerHour: Number
    }]
});

const job = mongoose.model('job', jobSchema);

module.exports = job;
