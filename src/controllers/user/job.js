const sendResponse = require("../../utils/responseStructure");

class JobController {
    constructor(jobService) {
        this.jobService = jobService;
    };

    async getJobs(req, res) {
        const { id, page } = req.params;
        const { lat, lon } = req.query;
        const result = await this.jobService.getJobs(id, page, lat, lon);
        sendResponse(res, result);
    };

    async getJob(req, res) {
        const { id } = req.params;
        const result = await this.jobService.getJob(id);
        sendResponse(res, result);
    };

    async getListedJobs(req, res) {
        const { id, page } = req.params;
        const result = await this.jobService.getListedJobs(id, page);
        sendResponse(res, result);
    };

    async getListedJob(req, res) {
        const { id } = req.params;
        const result = await this.jobService.getJob(id);
        sendResponse(res, result);
    };

    async getApplicants(req, res) {
        const { id, field } = req.params;
        const result = await this.jobService.getApplicants(id, field);
        sendResponse(res, result);
    };

    async takeApplicantAction(req, res) {
        const { jobId, fieldName, laborerId, actionTook, reason } = req.body;
        const result = await this.jobService.takeApplicantAction(
            jobId, fieldName, laborerId, actionTook, reason
        );
        sendResponse(res, result);
    };

    async editListedJob(req, res) {
        const { _id: id } = req.body;
        const result = await this.jobService.editListedJob(id, req.body);
        sendResponse(res, result);
    };

    async deleteListedJob(req, res) {
        const { id } = req.params;
        const result = await this.jobService.deleteListedJob(id);
        sendResponse(res, result);
    };

    async getWorksHistory(req, res) {
        const { id, page } = req.params;
        const result = await this.jobService.getWorksHistory(id, page);
        sendResponse(res, result);
    };

    async getRemainingPosts(req, res) {
        const { userId } = req.query;
        const result = await this.jobService.getRemainingPosts(userId);
        sendResponse(res, result);
    };

    async postJob(req, res) {
        const result = await this.jobService.postJob(req.body);
        sendResponse(res, result);
    };

    async applyJob(req, res) {
        const { jobId, laborerId, field } = req.body;
        const result = await this.jobService.applyJob(jobId, laborerId, field);
        sendResponse(res, result);
    };

    async cancelJobApplication(req, res) {
        const { jobId, laborerId, field } = req.body;
        const result = await this.jobService.cancelJobApplication(jobId, laborerId, field);
        sendResponse(res, result);
    };
};

module.exports = JobController;
