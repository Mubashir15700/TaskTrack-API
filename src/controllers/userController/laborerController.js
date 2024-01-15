const laborerService = require("../../services/userService/laborerService");
const catchAsync = require("../../utils/catchAsync");
const sendResponse = require("../../utils/responseStructure");

exports.getLaborers = catchAsync(async (req, res) => {
    const result = await laborerService.getLaborers();
    sendResponse(res, result);
});

exports.getLaborer = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await laborerService.getLaborer(id);
    sendResponse(res, result);
});

exports.sendRequest = catchAsync(async (req, res) => {
    const { formData } = req.body;
    const result = await laborerService.sendRequest(formData);
    sendResponse(res, result);
});
