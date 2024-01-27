const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    to: {
        type: mongoose.Schema.Types.Mixed,
        ref: "User",
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

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = Notification;
