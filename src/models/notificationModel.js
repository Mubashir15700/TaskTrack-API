const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    to: {
        type: mongoose.Schema.Types.Mixed,
        ref: "user",
        required: false
    },
    message: String,
    formData: Object,
    timestamp: { type: Date, default: Date.now },
    isOpend: {
        type: Boolean,
        default: false
    }
});

const notification = mongoose.model("notification", notificationSchema);

module.exports = notification;
