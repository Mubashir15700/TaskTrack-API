const fs = require('fs');
const path = require('path');
const userRepository = require('../repositories/userRepository');
const catchAsync = require('../utils/catchAsync');
const sendResponse = require('../utils/responseStructure');

exports.updateProfile = catchAsync(async (req, res) => {
    const { id } = req.query;
    const profileImage = req.file ? req.file.filename : null;

    const updateObject = req.body;

    if (profileImage) {
        updateObject.profile = profileImage;
    }

    const result = await userRepository.updateUser(id, updateObject);

    const { status, message, data } = result;
    sendResponse(res, { status, message, data: data || {} });
});

exports.deleteProfileImage = catchAsync(async (req, res) => {
    const { image } = req.body;
    const { id } = req.query;

    const result = await userRepository.deleteProfileImage(id);
    if (result.status === 201) {
        const imagePath = path.join(__dirname, '../../uploads/', image);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
    }

    const { status, message, data } = result;
    sendResponse(res, { status, message, data: data || {} });
});