const userService = require("../../services/userService/userService");
const catchAsync = require("../../utils/catchAsync");
const sendResponse = require("../../utils/responseStructure");

exports.getBanners = catchAsync(async (req, res) => {
    const result = await userService.getBanners();
    sendResponse(res, result);
});

exports.updateProfile = catchAsync(async (req, res) => {
    const { id } = req.query;
    const profileImage = req.file ? req.file.filename : null;
    const updateObject = req.body;
    const result = await userService.updateProfile(
        id, updateObject, profileImage
    );
    sendResponse(res, result);
});

exports.deleteProfileImage = catchAsync(async (req, res) => {
    const { image } = req.body;
    const { id } = req.query;
    const result = await userService.deleteProfileImage(id, image);
    sendResponse(res, result);
});

exports.getCurrentLocation = catchAsync(async (req, res) => {
    const { latitude, longitude } = req.body;
    const result = await userService.getCurrentLocation(latitude, longitude);
    sendResponse(res, result);
});

exports.deleteCurrentLocation = catchAsync(async (req, res) => {
    const { userId } = req.body;
    const result = await userService.deleteCurrentLocation(userId);
    sendResponse(res, result);
});

exports.getLaborers = catchAsync(async (req, res) => {
    const result = await userService.getLaborers();
    sendResponse(res, result);
});

exports.getLaborer = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await userService.getLaborer(id);
    sendResponse(res, result);
});

exports.getJobs = catchAsync(async (req, res) => {
    const result = await userService.getJobs();
    sendResponse(res, result);
});

exports.getJob = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await userService.getJob(id);
    sendResponse(res, result);
});

exports.editJob = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await userService.editJob(id, req.body);
    sendResponse(res, result);
});

exports.postJob = catchAsync(async (req, res) => {
    const result = await userService.postJob(req.body);
    sendResponse(res, result);
});
