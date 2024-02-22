const User = require("../models/user");
const repositoryErrorHandler = require("../utils/errorHandling/repositoryErrorHandler");

class UserRepository {
    async findUsersPaginated(startIndex, itemsPerPage) {
        try {
            return await User.find()
                .skip(startIndex)
                .limit(itemsPerPage)
                .select("-password");
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };

    async findUsersCount() {
        try {
            return await User.countDocuments();
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };

    async findUserById(id) {
        try {
            return await User.findById(id).select("-password");
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };

    async blockUnblockUser(id) {
        try {
            const user = await User.findById(id);
            const blockState = user.isBlocked;

            const updatedUser = await User.findByIdAndUpdate(id, {
                $set: { isBlocked: !blockState },
            }, { new: true }); // To return the updated document

            return { userId: updatedUser._id, blockStatus: updatedUser.isBlocked };
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };

    // searching
    async searchUsers(searchWith) {
        try {
            const searchResults = await User.find({
                $or: [
                    { username: { $regex: searchWith, $options: "i" } },
                    { email: { $regex: searchWith, $options: "i" } },
                ],
            });
            return searchResults;
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };

    async updateUserSubscription(userId, sessionId = null) {
        try {
            await User.findByIdAndUpdate(userId, {
                $set: { currentSubscription: sessionId }
            });
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };
};

module.exports = new UserRepository();
