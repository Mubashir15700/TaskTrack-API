const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    profile: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    otp: {
        type: Number,
        createdAt: { type: Date, expires: '5m', default: Date.now },
        select: false
    },
    isJobSeeker: {
        type: Boolean,
        default: false,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
});

const user = mongoose.model("user", userSchema);

module.exports = user;