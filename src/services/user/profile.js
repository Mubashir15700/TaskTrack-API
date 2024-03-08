const fs = require("fs");
const path = require("path");
const querystring = require("querystring");

class ProfileService {
    constructor (userRepository, laborerRepository) {
        this.userRepository = userRepository;
        this.laborerRepository = laborerRepository;
    };

    async updateProfile(id, updateObject, profileImage = null) {
        if (profileImage) {
            updateObject.profile = profileImage;
        }

        const updateResult = await this.userRepository.updateUser(id, updateObject);

        return {
            status: 200,
            message: "Update success",
            data: {
                updatedUser: updateResult
            }
        };
    };

    async deleteProfileImage(id, image) {
        const updateResult = await this.userRepository.deleteProfileImage(id);
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
    };

    async getCurrentLocation(lat, lon) {
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
    };

    async deleteCurrentLocation(userId) {
        const deleteResult = await this.userRepository.deleteCurrentLocation(userId);

        if (deleteResult) {
            return {
                status: 200,
                message: "Deleted user location successfully",
                data: {
                    deleteResult
                }
            };
        }
    };

    async updateLaborerProfile(data) {
        await this.laborerRepository.updateLaborerProfile(data);

        return {
            status: 200,
            message: "Update success",
        };
    };
};

module.exports = ProfileService;
