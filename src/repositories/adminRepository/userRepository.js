const User = require("../../models/userModel");
const Request = require("../../models/laborerRequestModel");

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
    async searchEmployers(searchWith) {
        try {
            const searchResults = await User.find({
                $or: [
                    { username: { $regex: searchWith, $options: "i" } },
                    { email: { $regex: searchWith, $options: "i" } },
                ],
                isJobSeeker: false,
            });
            return searchResults;
        } catch (error) {
            console.error(error);
            throw new Error("Error while searching employers");
        }
    };

    async searchLaborers(searchWith) {
        try {
            const searchResults = await User.find({
                $or: [
                    { username: { $regex: searchWith, $options: "i" } },
                    { email: { $regex: searchWith, $options: "i" } },
                ],
                isJobSeeker: true,
            });

            return searchResults;
        } catch (error) {
            console.error(error);
            throw new Error("Error while searching laborers");
        }
    };

    async getRequests(startIndex, itemsPerPage) {
        try {
            return await Request.find()
                .skip(startIndex)
                .limit(itemsPerPage);
        } catch (error) {
            console.error(error);
            throw new Error("Error while fetching paginated requests");
        }
    };

    async findRequestsCount() {
        try {
            return await Request.countDocuments();
        } catch (error) {
            console.error(error);
            throw new Error("Error while fetching request's count");
        }
    };

    async approveRejectAction(id) {
        try {
            console.log(id);
            // const user = await User.findById(id);
            // const blockState = user.isBlocked;

            // return await User.findByIdAndUpdate(id, {
            //     $set: { isBlocked: !blockState },
            // });
        } catch (error) {
            console.error(error);
            throw new Error("Error while updating user");
        }
    };
};

module.exports = new UserRepository();
