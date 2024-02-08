const laborerService = require("../../services/user/laborer");
const catchAsync = require("../../utils/errorHandling/catchAsync");
const sendResponse = require("../../utils/responseStructure");

exports.getLaborers = catchAsync(async (req, res) => {
    const { id, page } = req.params;
    const result = await laborerService.getLaborers(id, page);
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

exports.getPrevRequest = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await laborerService.getPrevRequest(id);
    sendResponse(res, result);
});

exports.updateRequest = catchAsync(async (req, res) => {
    const { formData } = req.body;
    const result = await laborerService.updateRequest(formData);
    sendResponse(res, result);
});

exports.cancelRequest = catchAsync(async (req, res) => {
    const { currentUserId } = req.body;
    const result = await laborerService.cancelRequest(currentUserId);
    sendResponse(res, result);
});
