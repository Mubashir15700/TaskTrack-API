const jobService = require("../../services/user/job");
const catchAsync = require("../../utils/errorHandling/catchAsync");
const sendResponse = require("../../utils/responseStructure");

exports.getJobs = catchAsync(async (req, res) => {
    const { id, page } = req.params;
    const result = await jobService.getJobs(id, page);
    sendResponse(res, result);
});

exports.getJob = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await jobService.getJob(id);
    sendResponse(res, result);
});

exports.getListedJobs = catchAsync(async (req, res) => {
    const { id, page } = req.params;
    const result = await jobService.getListedJobs(id, page);
    sendResponse(res, result);
});

exports.getListedJob = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await jobService.getJob(id);
    sendResponse(res, result);
});

exports.getApplicants = catchAsync(async (req, res) => {
    const { jobId, field } = req.params;
    const result = await jobService.getApplicants(jobId, field);
    sendResponse(res, result);
});

exports.takeApplicantAction = catchAsync(async (req, res) => {
    const { jobId, fieldName, laborerId, actionTook, reason } = req.body;
    const result = await jobService.takeApplicantAction(
        jobId, fieldName, laborerId, actionTook, reason
    );
    sendResponse(res, result);
});

exports.editListedJob = catchAsync(async (req, res) => {
    const { _id: id } = req.body;
    const result = await jobService.editListedJob(id, req.body);
    sendResponse(res, result);
});

exports.deleteListedJob = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await jobService.deleteListedJob(id);
    sendResponse(res, result);
});

exports.getWorksHistory = catchAsync(async (req, res) => {
    const { id, page } = req.params;
    const result = await jobService.getWorksHistory(id, page);
    sendResponse(res, result);
});

exports.getRemainingPosts = catchAsync(async (req, res) => {
    const { userId } = req.query;
    const result = await jobService.getRemainingPosts(userId);
    sendResponse(res, result);
});

exports.postJob = catchAsync(async (req, res) => {
    const result = await jobService.postJob(req.body);
    sendResponse(res, result);
});

exports.applyJob = catchAsync(async (req, res) => {
    const { jobId, laborerId, field } = req.body;
    const result = await jobService.applyJob(jobId, laborerId, field);
    sendResponse(res, result);
});

exports.cancelJobApplication = catchAsync(async (req, res) => {
    const { jobId, laborerId, field } = req.body;
    const result = await jobService.cancelJobApplication(jobId, laborerId, field);
    sendResponse(res, result);
});