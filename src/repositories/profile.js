const User = require("../models/user");
const Laborer = require("../models/laborer");

class ProfileRepository {
    async updateUser(id, updateObject) {
        try {
            console.log(updateObject);
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
            console.error(error);
            throw new Error("Error while updating profile");
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
            console.error(error);
            throw new Error("Error while deleting profile");
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
            console.error(error);
            throw new Error("Error while deleting profile");
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
            console.error(error);
            throw new Error("Error while updating profile");
        }
    };
};

module.exports = new ProfileRepository();
