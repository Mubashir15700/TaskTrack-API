const mongoose = require("mongoose");
const Job = require("../../models/jobPostModel");

class JobRepository {
    async getJobs() {
        try {
            return await Job.aggregate([
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
                        userDetails: {
                            username: '$userDetails.username',
                            profile: '$userDetails.profile',
                        },
                    },
                },
                {
                    $project: {
                        // Exclude the 'userDetails' array and convert the result to a single document
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
                        'userDetails.username': 1,
                        'userDetails.profile': 1,
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
            console.log(jobDetails);
        } catch (error) {
            console.log(error);
            throw new Error("Error while editing the job");
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
