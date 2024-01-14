const mongoose = require("mongoose");
const Job = require("../../models/jobPostModel");

class JobRepository {
    async getJobs(currentUserId) {
        try {
            return await Job.aggregate([
                {
                    $match: {
                        userId: { $ne: new mongoose.Types.ObjectId(currentUserId) },
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "userDetails",
                    },
                },
                {
                    $unwind: "$userDetails",
                },
                {
                    $project: {
                        _id: 1,
                        userId: 1,
                        title: 1,
                        description: 1,
                        date: 1,
                        time: 1,
                        duration: 1,
                        location: 1,
                        fields: 1,
                        postedAt: 1,
                        status: 1,
                        userDetails: {
                            username: "$userDetails.username",
                            profile: "$userDetails.profile",
                        },
                    },
                },
            ]);
        } catch (error) {
            console.log(error);
            throw new Error("Error while finding jobs");
        }
    };

    async getListedJobs(id) {
        try {
            return await Job.find({ userId: id });
        } catch (error) {
            console.log(error);
            throw new Error("Error while finding listed jobs");
        }
    };

    async getJob(id) {
        try {
            const job = await Job.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(id),
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'userDetails',
                    },
                },
                {
                    $unwind: '$userDetails',
                },
                {
                    $project: {
                        _id: 1,
                        userId: 1,
                        title: 1,
                        description: 1,
                        date: 1,
                        time: 1,
                        duration: 1,
                        location: 1,
                        fields: 1,
                        postedAt: 1,
                        status: 1,
                        userDetails: {
                            username: '$userDetails.username',
                            profile: '$userDetails.profile',
                        },
                    },
                },
            ]);

            return job[0];
        } catch (error) {
            console.log(error);
            throw new Error("Error while finding the job");
        }
    };

    async editJob(jobDetails) {
        try {
            const { jobId, title, description, date, time, duration, location, status, fields } = jobDetails;

            return await Job.findByIdAndUpdate(jobId, {
                $set: {
                    title, description, date, time, duration, location, status, fields
                }
            }, { new: true });
        } catch (error) {
            console.log(error);
            throw new Error("Error while editing the job");
        }
    };

    async deleteJob(id) {
        try {
            const deletedJob = await Job.findByIdAndDelete(id);
            if (!deletedJob) {
                throw new Error("Job not found for deletion");
            }
            return deletedJob;
        } catch (error) {
            console.log(error);
            throw new Error(`Error while deleting the job: ${error.message}`);
        }
    };

    async postJob(jobDetails) {
        try {
            const newJob = new Job(jobDetails);
            return await newJob.save();
        } catch (error) {
            console.log(error);
            throw new Error("Error while posting new job");
        }
    };

    async searchJobs(searchWith) {
        try {
            const searchResults = await Job.find({
                $or: [
                    { title: { $regex: searchWith, $options: "i" } },
                    { description: { $regex: searchWith, $options: "i" } },
                ],
            });
            return searchResults;
        } catch (error) {
            console.error(error);
            throw new Error("Error while searching jobss");
        }
    };

};

module.exports = new JobRepository();
