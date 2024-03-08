const mongoose = require("mongoose");
const calculateDistance = require("../../utils/calculateDistance");

class JobService {
    constructor(jobRepository, reasonRepository, subscriptionRepository) {
        this.jobRepository = jobRepository;
        this.reasonRepository = reasonRepository;
        this.subscriptionRepository = subscriptionRepository;
    };

    async getJobs(currentUserId, page, lat, lon) {
        const pageSize = 10;

        // Get jobs with pagination
        const jobs = await this.jobRepository.getJobs(currentUserId, null, page, pageSize);

        let jobsWithDistances;
        if (lat && lon) {
            // Calculate distances for each job
            jobsWithDistances = jobs.map(job => {
                const jobLat = job.location?.latitude;
                const jobLon = job.location?.longitude;
                // Check if job location exists
                if (jobLat !== undefined && jobLon !== undefined) {
                    const distance = calculateDistance(lat, lon, jobLat, jobLon);
                    return { ...job, distance };
                } else {
                    // Handle cases where job location is undefined
                    return { ...job, distance: Infinity }; // Set distance to Infinity or any other value as desired
                }
            });

            // Sort jobs based on distance
            jobsWithDistances.sort((a, b) => a.distance - b.distance);
        }

        // Get total number of jobs
        const totalJobs = await this.jobRepository.getJobsCount(currentUserId);
        const totalPages = Math.ceil(totalJobs / pageSize);

        return {
            status: 200,
            message: "get jobs success",
            data: {
                jobs: (lat && lon) ? jobsWithDistances : jobs,
                totalPages
            }
        };
    };

    async getListedJobs(id, page) {
        const pageSize = 10;

        const jobs = await this.jobRepository.getListedJobs(id, page, pageSize);

        const totalListedJobs = await this.jobRepository.getListedJobsCount(id);
        const totalPages = Math.ceil(totalListedJobs / pageSize);

        return {
            status: 200,
            message: "get listed jobs success",
            data: {
                jobs,
                totalPages
            }
        };
    };

    async getApplicants(jobId, field) {
        const applicants = await this.jobRepository.getApplicants(jobId, field);

        return {
            status: 200,
            message: "get listed job applicants success",
            data: {
                applicants
            }
        };
    };

    async takeApplicantAction(job, fieldName, laborerId, action, reason) {
        const result = await this.jobRepository.takeApplicantAction(job, fieldName, laborerId, action);

        if (!result) {
            return { status: 404, message: "No application found" };
        }

        if (action === "rejected") {
            await this.reasonRepository.saveBlockReason(
                laborerId, "employer_reject_laborer", reason
            );
        } else {
            await this.reasonRepository.removeBlockReason(laborerId, "employer_reject_laborer");
        }

        return {
            status: 200,
            message: `${action} applicant successfully`,
        };
    };

    async getJob(id) {
        const job = await this.jobRepository.getJob(id);

        return {
            status: 200,
            message: "get job success",
            data: {
                job
            }
        };
    };

    async editListedJob(jobId, jobDetails) {
        const { title, description, date, time, duration, location, status, fields } = jobDetails;
        if (!title || !description || !date || !time || !duration || !location || !status || !fields) {
            return { status: 400, message: "All fields are required" };
        }

        try {
            const editResult = await this.jobRepository.editJob({
                jobId, title, description, date, time, duration, location, status, fields
            });

            if (editResult) {
                return {
                    status: 200,
                    message: "Edited job successfully",
                };
            }
        } catch (error) {
            return { status: 500, message: "Internal Server Error" };
        }
    };

    async deleteListedJob(jobId) {
        const deleteResult = await this.jobRepository.deleteJob(jobId);

        if (deleteResult) {
            return {
                status: 200,
                message: "Deleted job successfully",
            };
        }
    };

    async getWorksHistory(id, page) {
        const pageSize = 10;

        const works = await this.jobRepository.getWorksHistory(id, page, pageSize);

        const totalWorksDone = await this.jobRepository.getWorksDoneCount(id);
        const totalPages = Math.ceil(totalWorksDone / pageSize);

        return {
            status: 200,
            message: "get works history success",
            data: {
                works,
                totalPages
            }
        };
    };

    async getRemainingPosts(userId) {
        const postedJobsCount = await this.subscriptionRepository.postedJobsCount(userId);
        const totalPosts = await this.subscriptionRepository.totalJobPostsCount(userId);
        return {
            status: 200,
            message: "get remaining post's count success",
            data: {
                remainingPosts: totalPosts - postedJobsCount
            }
        };
    };

    async postJob(jobDetails) {
        const { userId, title, description, date, time, duration, location, fields } = jobDetails;
        if (!title || !description || !date || !time || !duration || !location || !fields) {
            return { status: 400, message: "All fields are required" };
        }

        const postResult = await this.jobRepository.postJob({
            userId, title, description, date, time, duration, location, fields
        });

        if (postResult) {
            await this.subscriptionRepository.updateJobPostsCount(userId);

            return {
                status: 200,
                message: "Posted new job successfully",
            };
        }
    };

    async applyJob(jobId, laborerId, fieldName) {
        if (!jobId || !laborerId) {
            return { status: 400, message: "Bad Request: Missing required parameters" };
        }

        const jobPostToApply = await this.jobRepository.jobPostToApply(jobId);

        if (!jobPostToApply) {
            return { status: 404, message: "Job not found" };
        }

        let fieldFound = false;
        jobPostToApply.fields.forEach(field => {
            if (field.name === fieldName) {
                field.applicants.push({ userId: laborerId });
                fieldFound = true;
            }
        });

        if (!fieldFound) {
            return { status: 404, message: "Field not found in the job" };
        }

        await jobPostToApply.save();

        return {
            status: 200,
            message: "Applied for the job successfully",
        };
    };

    async cancelJobApplication(jobId, laborerId, fieldName) {
        if (!jobId || !laborerId) {
            return { status: 400, message: "Bad Request: Missing required parameters" };
        }

        const jobPost = await this.jobRepository.jobPostToApply(jobId);

        if (!jobPost) {
            return { status: 404, message: "Job not found" };
        }

        const laborerObjectId = new mongoose.Types.ObjectId(laborerId);
        let fieldFound = false;
        jobPost.fields.forEach(field => {
            if (field.name === fieldName) {
                // Remove the laborer ID from the applicants array
                field.applicants = field.applicants.filter(applicant => applicant.userId.toString() !== laborerObjectId.toString());
                fieldFound = true;
            }
        });

        if (!fieldFound) {
            return { status: 404, message: "Field not found in the job" };
        }

        await jobPost.save();

        return {
            status: 200,
            message: "Cancelled job application successfully",
        };
    };
};

module.exports = JobService;
