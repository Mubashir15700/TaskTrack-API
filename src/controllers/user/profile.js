const sendResponse = require("../../utils/responseStructure");

class ProfileController {
    constructor(profileService) {
        this.profileService = profileService;
    };

    async updateProfile(req, res) {
        const { id } = req.query;
        const profileImage = req.file ? req.file.filename : null;
        const updateObject = req.body;
        const result = await this.profileService.updateProfile(
            id, updateObject, profileImage
        );
        sendResponse(res, result);
    };

    async deleteProfileImage(req, res) {
        const { image, id } = req.query;
        const result = await this.profileService.deleteProfileImage(id, image);
        sendResponse(res, result);
    };

    async getCurrentLocation(req, res) {
        const { latitude, longitude } = req.query;
        const result = await this.profileService.getCurrentLocation(latitude, longitude);
        sendResponse(res, result);
    };

    async deleteCurrentLocation(req, res) {
        const { id } = req.params;
        const result = await this.profileService.deleteCurrentLocation(id);
        sendResponse(res, result);
    };

    async updateLaborerProfile(req, res) {
        const data = req.body;
        const result = await this.profileService.updateLaborerProfile(data);
        sendResponse(res, result);
    };
};

module.exports = ProfileController;
