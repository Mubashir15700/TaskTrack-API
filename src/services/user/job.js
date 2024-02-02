const mongoose = require("mongoose");
const jobRepository = require("../../repositories/job");
const planRepository = require("../../repositories/plan");
const serverErrorHandler = require("../../utils/errorHandling/serverErrorHandler");

class JobService {
    async getJobs(currentUserId) {
        try {
            const jobs = await jobRepository.getJobs(currentUserId);

            return {
                status: 201,
                message: "get jobs success",
                data: {
                    jobs
                }
            };
        } catch (error) {
            return serverErrorHandler("An error occurred during fetching jobs: ", error);
        }
    };

    async getListedJobs(id) {
        try {
            const jobs = await jobRepository.getListedJobs(id);

            return {
                status: 201,
                message: "get listed jobs success",
                data: {
                    jobs
                }
            };
        } catch (error) {
            return serverErrorHandler("An error occurred during fetching listed jobs: ", error);
        }
    };

    async getApplicants(jobId, field) {
        try {
            const applicants = await jobRepository.getApplicants(jobId, field);

            return {
                status: 201,
                message: "get listed job applicants success",
                data: {
                    applicants
                }
            };
        } catch (error) {
            return serverErrorHandler("An error occurred during fetching applicants: ", error);
        }
    };

    async takeApplicantAction(job, fieldName, laborerId, action) {
        try {
            await jobRepository.takeApplicantAction(job, fieldName, laborerId, action);

            return {
                status: 201,
                message: `${action} applicant successfully`,
            };
        } catch (error) {
            return serverErrorHandler("An error occurred during taking action: ", error);
        }
    };

    async getJob(id) {
        try {
            const job = await jobRepository.getJob(id);

            return {
                status: 201,
                message: "get job success",
                data: {
                    job
                }
            };
        } catch (error) {
            return serverErrorHandler("An error occurred during fetching job: ", error);
        }
    };

    async editListedJob(jobId, jobDetails) {
        try {
            const { title, description, date, time, duration, location, status, fields } = jobDetails;
            if (!title || !description || !date || !time || !duration || !location || !status || !fields) {
                return { status: 400, message: "All fields are required" };
            }

            const editResult = await jobRepository.editJob({
                jobId, title, description, date, time, duration, location, status, fields
            });

            if (editResult) {
                return {
                    status: 201,
                    message: "Edited job successfully",
                };
            }
        } catch (error) {
            return serverErrorHandler("An error occurred during editing listed job: ", error);
        }
    };

    async deleteListedJob(jobId) {
        try {
            const deleteResult = await jobRepository.deleteJob(jobId);

            if (deleteResult) {
                return {
                    status: 201,
                    message: "Deleted job successfully",
                };
            }
        } catch (error) {
            return serverErrorHandler("An error occurred during deleting listed job: ", error);
        }
    };

    async getWorksHistory(id) {
        try {
            const works = await jobRepository.getWorksHistory(id);

            return {
                status: 201,
                message: "get works history success",
                data: {
                    works
                }
            };
        } catch (error) {
            return serverErrorHandler("An error occurred during fetching work history: ", error);
        }
    };

    async getRemainingPosts(userId) {
        try {
            const postedJobsCount = await planRepository.postedJobsCount(userId);
            const totalPosts = await planRepository.totalJobPostsCount(userId);

            return {
                status: 201,
                message: "get remaining post's count success",
                data: {
                    remainingPosts: totalPosts - postedJobsCount
                }
            };
        } catch (error) {
            return serverErrorHandler(
                "An error occurred during fetching remainig job post's count: ", error
            );
        }
    };

    async postJob(jobDetails) {
        try {
            const { userId, title, description, date, time, duration, location, fields } = jobDetails;
            if (!title || !description || !date || !time || !duration || !location || !fields) {
                return { status: 400, message: "All fields are required" };
            }

            const postResult = await jobRepository.postJob({
                userId, title, description, date, time, duration, location, fields
            });

            if (postResult) {
                await planRepository.updateJobPostsCount(userId);

                return {
                    status: 201,
                    message: "Posted new job successfully",
                };
            }
        } catch (error) {
            return serverErrorHandler("An error occurred during posting job: ", error);
        }
    };

    async applyJob(jobId, laborerId, fieldName) {
        try {
            if (!jobId || !laborerId) {
                return { status: 400, message: "Bad Request: Missing required parameters" };
            }

            const jobPostToApply = await jobRepository.jobPostToApply(jobId);

            if (!jobPostToApply) {
                return { status: 400, message: "Job not found" };
            }

            jobPostToApply.fields.forEach(field => {
                if (field.name === fieldName) {
                    field.applicants.push({ userId: laborerId });
                }
            });

            await jobPostToApply.save();

            return {
                status: 201,
                message: "Applied for the job successfully",
            };
        } catch (error) {
            return serverErrorHandler("An error occurred during applying for job: ", error);
        }
    };

    async cancelJobApplication(jobId, laborerId, fieldName) {
        try {
            if (!jobId || !laborerId) {
                return { status: 400, message: "Bad Request: Missing required parameters" };
            }

            const jobPost = await jobRepository.jobPostToApply(jobId);

            if (!jobPost) {
                return { status: 400, message: "Job not found" };
            }

            const laborerObjectId = new mongoose.Types.ObjectId(laborerId);
            jobPost.fields.forEach(field => {
                if (field.name === fieldName) {
                    // Remove the laborer ID from the applicants array
                    field.applicants = field.applicants.filter(applicant => applicant.userId.toString() !== laborerObjectId.toString());
                }
            });

            await jobPost.save();

            return {
                status: 201,
                message: "Cancelled job application successfully",
            };
        } catch (error) {
            return serverErrorHandler("An error occurred during cancelling job application: ", error);
        }
    };
};

module.exports = new JobService();
