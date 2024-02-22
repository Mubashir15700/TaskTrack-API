const User = require("../models/user");
const Laborer = require("../models/laborer");
const repositoryErrorHandler = require("../utils/errorHandling/repositoryErrorHandler");

class ProfileRepository {
    async updateUser(id, updateObject) {
        try {
            return await User.findByIdAndUpdate(
                id,
                {
                    $set: {
                        ...updateObject,
                    }
                },
                { new: true }
            ).select("-password");
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };

    async deleteProfileImage(id) {
        try {
            return await User.findByIdAndUpdate(
                id,
                {
                    $unset: {
                        profile: 1,
                    },
                },
                { new: true }
            ).select("-password");
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };

    async deleteCurrentLocation(id) {
        try {
            return await User.findByIdAndUpdate(
                id,
                {
                    $unset: {
                        location: 1,
                    },
                },
                { new: true }
            );
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };

    async updateLaborerProfile(data) {
        try {
            await Laborer.findOneAndUpdate({
                userId: data.userId
            },
                {
                    $set: {
                        ...data
                    }
                },
                { new: true }
            );
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };
};

module.exports = new ProfileRepository();
