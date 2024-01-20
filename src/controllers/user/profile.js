const profileService = require("../../services/user/profile");
const catchAsync = require("../../utils/catchAsync");
const sendResponse = require("../../utils/responseStructure");

exports.updateProfile = catchAsync(async (req, res) => {
    const { id } = req.query;
    const profileImage = req.file ? req.file.filename : null;
    const updateObject = req.body;
    const result = await profileService.updateProfile(
        id, updateObject, profileImage
    );
    sendResponse(res, result);
});

exports.deleteProfileImage = catchAsync(async (req, res) => {
    const { image } = req.body;
    const { id } = req.query;
    const result = await profileService.deleteProfileImage(id, image);
    sendResponse(res, result);
});

exports.getCurrentLocation = catchAsync(async (req, res) => {
    const { latitude, longitude } = req.query;
    const result = await profileService.getCurrentLocation(latitude, longitude);
    sendResponse(res, result);
});

exports.deleteCurrentLocation = catchAsync(async (req, res) => {
    const { userId } = req.body;
    const result = await profileService.deleteCurrentLocation(userId);
    sendResponse(res, result);
});
