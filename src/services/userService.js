const fs = require("fs");
const path = require("path");
const userRepository = require('../repositories/userRepository');

class UserService {
    async updateProfile(id, updateObject, profileImage) {
        try {
            if (profileImage) {
                updateObject.profile = profileImage;
            }

            const updateResult = await userRepository.updateUser(id, updateObject);

            return {
                status: 201,
                message: "Update success",
                data: {
                    updatedUser: updateResult
                }
            };
        } catch (error) {
            console.log(error);
            return {
                status: 500, message: `Internal Server Error: ${error.message}`
            };
        }
    };

    async deleteProfileImage(id, image) {
        try {
            const updateResult = await userRepository.deleteProfileImage(id);
            if (updateResult) {
                const imagePath = path.join(__dirname, "../../uploads/", image);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }

            return {
                status: 201,
                message: "Deletd profile image successfully",
                data: {
                    updatedUser: updateResult
                }
            };
        } catch (error) {
            console.log(error);
            return {
                status: 500, message: `Internal Server Error: ${error.message}`
            };
        }
    };
};

module.exports = new UserService();
