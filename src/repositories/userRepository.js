const User = require('../models/userModel');

class UserRepository {
    async updateUser(id, updateObject) {
        try {
            const updatedUser = await User.findByIdAndUpdate(
                id,
                {
                    $set: {
                        ...updateObject,
                    }
                },
                { new: true }
            ).select('-password');

            if (updatedUser) {
                return {
                    status: 201,
                    message: `Updated profile successfully`,
                    data: {
                        updatedUser,
                    },
                };
            } else {
                return { status: 401, success: false, message: 'User not found' };
            }
        } catch (error) {
            console.error(error);
            throw new Error("Error while updating profile");
        }
    };

    async deleteProfileImage(id) {
        try {
            const updatedUser = await User.findByIdAndUpdate(
                id,
                {
                    $unset: {
                        profile: 1,
                    },
                },
                { new: true }
            ).select('-password');

            if (updatedUser) {
                return {
                    status: 201,
                    message: `Deleted profile image successfully`,
                    data: {
                        updatedUser,
                    },
                };
            } else {
                return { status: 401, success: false, message: 'User not found' };
            }
        } catch (error) {
            console.error(error);
            throw new Error("Error while deleting profile");
        }
    }
};

module.exports = new UserRepository();