const Reason = require("../models/reason");

class ReasonRepository {
    async saveBlockReason(userId, action, reason) {
        try {
            const blockReason = new Reason({
                userId,
                action,
                reason
            });
            await blockReason.save();
        } catch (error) {
            console.error(error);
            throw new Error("Error while saving block reason");
        }
    };

    async removeBlockReason(userId, action) {
        try {
            await Reason.findOneAndDelete({ userId, action });
        } catch (error) {
            console.error(error);
            throw new Error("Error while removing block reason");
        }
    };

    async findBlockReason(userId, action) {
        try {
            return await Reason.findOne({ userId, action });
        } catch (error) {
            console.error(error);
            throw new Error("Error while removing block reason");
        }
    };
};

module.exports = new ReasonRepository();
