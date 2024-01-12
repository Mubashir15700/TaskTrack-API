const jobService = require("../../services/userService/jobService");
const catchAsync = require("../../utils/catchAsync");
const sendResponse = require("../../utils/responseStructure");

exports.getJobs = catchAsync(async (req, res) => {
    const result = await jobService.getJobs();
    sendResponse(res, result);
});

exports.getListedJobs = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await jobService.getListedJobs(id);
    sendResponse(res, result);
});

exports.getJob = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await jobService.getJob(id);
    sendResponse(res, result);
});

exports.editJob = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await jobService.editJob(id, req.body);
    sendResponse(res, result);
});

exports.postJob = catchAsync(async (req, res) => {
    const result = await jobService.postJob(req.body);
    sendResponse(res, result);
});
