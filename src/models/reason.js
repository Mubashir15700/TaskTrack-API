const mongoose = require("mongoose");

// Define the enum for valid actions
const validActions = [
    "employer_reject_laborer",
    "admin_block_user",
    "admin_reject_laborer_request"
];

const ReasonSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    action: {
        type: String,
        required: true,
        enum: validActions
    },
    reason: {
        type: String,
        required: true
    }
});

const Reason = mongoose.model("Reason", ReasonSchema);

module.exports = Reason; 
