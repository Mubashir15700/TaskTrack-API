const User = require("../models/user");

class UserRepository {
    async findCurrentUserById(id) {
        return await User.findById(id).select("-password");
    };

    async checkExistingUsername(username) {
        return await User.findOne({ username });
    };

    async checkExistingEmail(email) {
        return await User.findOne({ email });
    };

    async createUser(username, email, phone, hashPassword, generatedOTP, isVerified = false) {
        const newUser = new User({
            username,
            email,
            phone,
            password: hashPassword,
            otp: generatedOTP,
            isVerified
        });

        return await newUser.save();
    };

    // user login
    async findUserByUsername(username) {
        return await User.findOne({ username });
    };

    async findUserByEmail(email) {
        return await User.findOne({ email });
    };

    // verify otp
    async findUserByOtp(otp) {
        return await User.findOne({ otp });
    };

    async findUserAndVerify(email) {
        return await User.findOneAndUpdate(
            { email },
            { $set: { isVerified: true } },
            { new: true }
        );
    };

    // resend otp
    async findUserAndUpdateOtp(email, newOtp) {
        return await User.findOneAndUpdate(
            { email },
            { $set: { otp: newOtp } },
            { new: true }
        );
    };

    // reset password
    async findUserById(id) {
        return await User.findById(id);
    };

    async updateUserPassword(userId, newPassword) {
        const user = await User.findById(userId);
        user.password = newPassword;
        return await user.save();
    };

    async findUsersPaginated(startIndex, itemsPerPage) {
        return await User.find()
            .skip(startIndex)
            .limit(itemsPerPage)
            .select("-password");
    };

    async findUsersCount() {
        return await User.countDocuments();
    };

    async findUserById(id) {
        return await User.findById(id).select("-password");
    };

    async blockUnblockUser(id) {
        const user = await User.findById(id);
        const blockState = user.isBlocked;

        const updatedUser = await User.findByIdAndUpdate(id, {
            $set: { isBlocked: !blockState },
        }, { new: true }); // To return the updated document

        return { userId: updatedUser._id, blockStatus: updatedUser.isBlocked };
    };

    // searching
    async searchUsers(searchWith) {
        return await User.find({
            $or: [
                { username: { $regex: searchWith, $options: "i" } },
                { email: { $regex: searchWith, $options: "i" } },
            ],
        });
    };

    async updateUserSubscription(userId, sessionId = null) {
        return await User.findByIdAndUpdate(userId, {
            $set: { currentSubscription: sessionId }
        });
    };

    // user becomes to laborer
    async changeToJobSeeker(id) {
        return await User.findByIdAndUpdate(id, {
            $set: { isJobSeeker: true }
        }, { new: true });
    };

    // profile
    async updateUser(id, updateObject) {
        return await User.findByIdAndUpdate(
            id,
            {
                $set: {
                    ...updateObject,
                }
            },
            { new: true }
        ).select("-password");
    };

    async deleteProfileImage(id) {
        return await User.findByIdAndUpdate(
            id,
            {
                $unset: {
                    profile: 1,
                },
            },
            { new: true }
        ).select("-password");
    };

    async deleteCurrentLocation(id) {
        return await User.findByIdAndUpdate(
            id,
            {
                $unset: {
                    location: 1,
                },
            },
            { new: true }
        );
    };
};

module.exports = UserRepository;
