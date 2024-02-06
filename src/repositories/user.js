const User = require("../models/user");

class UserRepository {
    async findUsersPaginated(startIndex, itemsPerPage) {
        try {
            return await User.find()
                .skip(startIndex)
                .limit(itemsPerPage)
                .select("-password");
        } catch (error) {
            console.error(error);
            throw new Error("Error while fetching paginated users");
        }
    };

    async findUsersCount() {
        try {
            return await User.countDocuments();
        } catch (error) {
            console.error(error);
            throw new Error("Error while fetching user's count");
        }
    };

    async findUserById(id) {
        try {
            return await User.findById(id).select("-password");
        } catch (error) {
            console.error(error);
            throw new Error("Error while fetching user");
        }
    };

    async blockUnblockUser(id) {
        try {
            const user = await User.findById(id);
            const blockState = user.isBlocked;

            return await User.findByIdAndUpdate(id, {
                $set: { isBlocked: !blockState },
            });
        } catch (error) {
            console.error(error);
            throw new Error("Error while updating user");
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
            console.error(error);
            throw new Error("Error while searching users");
        }
    };

    async updateUserSubscription(userId, sessionId = null) {
        try {
            await User.findByIdAndUpdate(userId, {
                $set: { currentSubscription: sessionId }
            });
            // return searchResults;
        } catch (error) {
            console.error(error);
            throw new Error("Error while updating subscription");
        }
    };
};

module.exports = new UserRepository();
