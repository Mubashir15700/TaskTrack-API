const mongoose = require("mongoose");
const jobRepository = require("../../repositories/job");
const reasonRepository = require("../../repositories/reason");
const subscriptionRepository = require("../../repositories/subscription");
const calculateDistance = require("../../utils/calculateDistance");
const serverErrorHandler = require("../../utils/errorHandling/serverErrorHandler");

class JobService {
    async getJobs(currentUserId, page, lat, lon) {
        try {
            const pageSize = 10;

            // Get jobs with pagination
            const jobs = await jobRepository.getJobs(currentUserId, null, page, pageSize);

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
            const totalJobs = await jobRepository.getJobsCount(currentUserId);
            const totalPages = Math.ceil(totalJobs / pageSize);

            return {
                status: 200,
                message: "get jobs success",
                data: {
                    jobs: (lat && lon) ? jobsWithDistances : jobs,
                    totalPages
                }
            };
        } catch (error) {
            return serverErrorHandler(error.message);
        }
    };

    async getListedJobs(id, page) {
        try {
            const pageSize = 10;

            const jobs = await jobRepository.getListedJobs(id, page, pageSize);

            const totalListedJobs = await jobRepository.getListedJobsCount(id);
            const totalPages = Math.ceil(totalListedJobs / pageSize);

            return {
                status: 200,
                message: "get listed jobs success",
                data: {
                    jobs,
                    totalPages
                }
            };
        } catch (error) {
            return serverErrorHandler(error.message);
        }
    };

    async getApplicants(jobId, field) {
        try {
            const applicants = await jobRepository.getApplicants(jobId, field);

            return {
                status: 200,
                message: "get listed job applicants success",
                data: {
                    applicants
                }
            };
        } catch (error) {
            return serverErrorHandler(error.message);
        }
    };

    async takeApplicantAction(job, fieldName, laborerId, action, reason) {
        try {
            const result = await jobRepository.takeApplicantAction(job, fieldName, laborerId, action);

            if (!result) {
                throw new Error("No application found");
            }

            if (action === "rejected") {
                await reasonRepository.saveBlockReason(
                    laborerId, "employer_reject_laborer", reason
                );
            } else {
                await reasonRepository.removeBlockReason(laborerId, "employer_reject_laborer");
            }

            return {
                status: 200,
                message: `${action} applicant successfully`,
            };
        } catch (error) {
            return serverErrorHandler(error.message);
        }
    };

    async getJob(id) {
        try {
            const job = await jobRepository.getJob(id);

            return {
                status: 200,
                message: "get job success",
                data: {
                    job
                }
            };
        } catch (error) {
            return serverErrorHandler(error.message);
        }
    };

    async editListedJob(jobId, jobDetails) {
        try {
            const { title, description, date, time, duration, location, status, fields } = jobDetails;
            if (!title || !description || !date || !time || !duration || !location || !status || !fields) {
                throw new Error("All fields are required");
            }

            const editResult = await jobRepository.editJob({
                jobId, title, description, date, time, duration, location, status, fields
            });

            if (editResult) {
                return {
                    status: 200,
                    message: "Edited job successfully",
                };
            }
        } catch (error) {
            return serverErrorHandler(error.message);
        }
    };

    async deleteListedJob(jobId) {
        try {
            const deleteResult = await jobRepository.deleteJob(jobId);

            if (deleteResult) {
                return {
                    status: 200,
                    message: "Deleted job successfully",
                };
            }
        } catch (error) {
            return serverErrorHandler(error.message);
        }
    };

    async getWorksHistory(id, page) {
        try {
            const pageSize = 10;

            const works = await jobRepository.getWorksHistory(id, page, pageSize);

            const totalWorksDone = await jobRepository.getWorksDoneCount(id);
            const totalPages = Math.ceil(totalWorksDone / pageSize);

            return {
                status: 200,
                message: "get works history success",
                data: {
                    works,
                    totalPages
                }
            };
        } catch (error) {
            return serverErrorHandler(error.message);
        }
    };

    async getRemainingPosts(userId) {
        try {
            const postedJobsCount = await subscriptionRepository.postedJobsCount(userId);
            const totalPosts = await subscriptionRepository.totalJobPostsCount(userId);
            return {
                status: 200,
                message: "get remaining post's count success",
                data: {
                    remainingPosts: totalPosts - postedJobsCount
                }
            };
        } catch (error) {
            return serverErrorHandler(error.message);
        }
    };

    async postJob(jobDetails) {
        try {
            const { userId, title, description, date, time, duration, location, fields } = jobDetails;
            if (!title || !description || !date || !time || !duration || !location || !fields) {
                throw new Error("All fields are required");
            }

            const postResult = await jobRepository.postJob({
                userId, title, description, date, time, duration, location, fields
            });

            if (postResult) {
                await subscriptionRepository.updateJobPostsCount(userId);

                return {
                    status: 200,
                    message: "Posted new job successfully",
                };
            }
        } catch (error) {
            return serverErrorHandler(error.message);
        }
    };

    async applyJob(jobId, laborerId, fieldName) {
        try {
            if (!jobId || !laborerId) {
                throw new Error("Bad Request: Missing required parameters");
            }

            const jobPostToApply = await jobRepository.jobPostToApply(jobId);

            if (!jobPostToApply) {
                throw new Error("Job not found");
            }

            jobPostToApply.fields.forEach(field => {
                if (field.name === fieldName) {
                    field.applicants.push({ userId: laborerId });
                }
            });

            await jobPostToApply.save();

            return {
                status: 200,
                message: "Applied for the job successfully",
            };
        } catch (error) {
            return serverErrorHandler(error.message);
        }
    };

    async cancelJobApplication(jobId, laborerId, fieldName) {
        try {
            if (!jobId || !laborerId) {
                throw new Error("Bad Request: Missing required parameters");
            }

            const jobPost = await jobRepository.jobPostToApply(jobId);

            if (!jobPost) {
                throw new Error("Job not found");
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
                status: 200,
                message: "Cancelled job application successfully",
            };
        } catch (error) {
            return serverErrorHandler(error.message);
        }
    };
};

module.exports = new JobService();
