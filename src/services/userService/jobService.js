const jobRepository = require("../../repositories/userRepository/jobRepository");

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
            console.log(error);
            return {
                status: 500, message: `Internal Server Error: ${error.message}`
            };
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
            console.log(error);
            return {
                status: 500, message: `Internal Server Error: ${error.message}`
            };
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
            console.log(error);
            return {
                status: 500, message: `Internal Server Error: ${error.message}`
            };
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
            console.log(error);
            return {
                status: 500, message: `Internal Server Error: ${error.message}`
            };
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
            console.log(error);
            return {
                status: 500, message: `Internal Server Error: ${error.message}`
            };
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
                return {
                    status: 201,
                    message: "Posted new job successfully",
                };
            }
        } catch (error) {
            console.log(error);
            return {
                status: 500, message: `Internal Server Error: ${error.message}`
            };
        }
    };
};

module.exports = new JobService();
