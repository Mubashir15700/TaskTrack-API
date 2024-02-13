const fs = require("fs");
const path = require("path");
const querystring = require("querystring");
const profileRepository = require("../../repositories/profile");
const serverErrorHandler = require("../../utils/errorHandling/serverErrorHandler");

class ProfileService {
    async updateProfile(id, updateObject, profileImage = null) {
        try {
            if (profileImage) {
                updateObject.profile = profileImage;
            }

            const updateResult = await profileRepository.updateUser(id, updateObject);

            return {
                status: 200,
                message: "Update success",
                data: {
                    updatedUser: updateResult
                }
            };
        } catch (error) {
            return serverErrorHandler("An error occurred during updating profile: ", error);
        }
    };

    async deleteProfileImage(id, image) {
        try {
            const updateResult = await profileRepository.deleteProfileImage(id);
            if (updateResult) {
                const imagePath = path.join(__dirname, "../../../uploads/profile/", image);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                } else {
                    console.log("File does not exist.");
                }
            }

            return {
                status: 200,
                message: "Deletd profile image successfully",
                data: {
                    updatedUser: updateResult
                }
            };
        } catch (error) {
            return serverErrorHandler("An error occurred during deleting profile image: ", error);
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
                status: 200,
                message: "Fetched user location successfully",
                data: {
                    fullAddress
                }
            };
        } catch (error) {
            return serverErrorHandler("An error occurred during fetching current location: ", error);
        }
    };

    async deleteCurrentLocation(userId) {
        try {
            const deleteResult = await profileRepository.deleteCurrentLocation(userId);

            if (deleteResult) {
                return {
                    status: 200,
                    message: "Deleted user location successfully",
                    data: {
                        deleteResult
                    }
                };
            }
        } catch (error) {
            return serverErrorHandler("An error occurred during deleting current location: ", error);
        }
    };

    async updateLaborerProfile(data) {
        try {
            await profileRepository.updateLaborerProfile(data);

            return {
                status: 200,
                message: "Update success",
            };
        } catch (error) {
            return serverErrorHandler("An error occurred during updating laborer profile: ", error);
        }
    };

};

module.exports = new ProfileService();
