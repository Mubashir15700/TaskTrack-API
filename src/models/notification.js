const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    to: {
        type: mongoose.Schema.Types.Mixed,
        ref: "user",
        required: false
    },
    message: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    isViewed: {
        type: Boolean,
        default: false
    },
    isOpened: {
        type: Boolean,
        default: false
    },
    redirectTo: {
        type: String,  
    },
});

const notification = mongoose.model("notification", notificationSchema);

module.exports = notification;
