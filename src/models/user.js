const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
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
        // required: true,
    },
    profile: {
        type: String,
    },
    location: {
        road: {
            type: String,
        },
        village: {
            type: String,
        },
        district: {
            type: String,
        },
        state: {
            type: String,
        },
        postcode: {
            type: String,
        },
    },
    password: {
        type: String,
        // required: true,
    },
    otp: {
        type: Number,
        createdAt: { type: Date, expires: "5m", default: Date.now },
        select: false,
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
    currentSubscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subscription",
        default: null
    },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
