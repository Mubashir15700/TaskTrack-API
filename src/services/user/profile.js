const fs = require("fs");
const path = require("path");
const querystring = require("querystring");
const profileRepository = require("../../repositories/profile");

class ProfileService {
    async updateProfile(id, updateObject, profileImage = null) {
        try {
            if (profileImage) {
                updateObject.profile = profileImage;
            }

            const updateResult = await profileRepository.updateUser(id, updateObject);

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
            const updateResult = await profileRepository.deleteProfileImage(id);
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

    async getCurrentLocation(lat, lon) {
        try {
            const url = `https://api.opencagedata.com/geocode/v1/json?${querystring.stringify({
                key: process.env.OPENCAGE_API_KEY,
                q: `${lat},${lon}`,
                language: "en",
            })}`;

            const response = await fetch(url);
            const data = await response.json();

            const firstResult = data.results[0];
            const fullAddress = {
                lat,
                lon,
                road: firstResult.components.road || "",
                village: firstResult.components.village || "",
                district: firstResult.components.state_district || "",
                state: firstResult.components.state || "",
                postcode: firstResult.components.postcode || "",
            };

            return {
                status: 201,
                message: "Fetched user location successfully",
                data: {
                    fullAddress
                }
            };
        } catch (error) {
            console.log(error);
            return {
                status: 500, message: `Internal Server Error: ${error.message}`
            };
        }
    };

    async deleteCurrentLocation(userId) {
        try {
            const deleteResult = await profileRepository.deleteCurrentLocation(userId);

            if (deleteResult) {
                return {
                    status: 201,
                    message: "Deleted user location successfully",
                    data: {
                        deleteResult
                    }
                };
            }
        } catch (error) {
            console.log(error);
            return {
                status: 500, message: `Internal Server Error: ${error.message}`
            };
        }
    };
};

module.exports = new ProfileService();
