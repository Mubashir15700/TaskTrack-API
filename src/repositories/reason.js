const Reason = require("../models/reason");
const repositoryErrorHandler = require("../utils/errorHandling/repositoryErrorHandler");

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
            repositoryErrorHandler(error);
        }
    };

    async removeBlockReason(userId, action) {
        try {
            await Reason.findOneAndDelete({ userId, action });
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };

    async findBlockReason(userId, action) {
        try {
            return await Reason.findOne({ userId, action });
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };
};

module.exports = new ReasonRepository();
