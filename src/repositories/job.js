const { ObjectId } = require("mongoose").Types;
const Job = require("../models/jobPost");

class JobRepository {
    async getJobsCount(id) {
        try {
            const query = id !== "undefined" ?
                { userId: { $ne: new ObjectId(id) } } :
                {};
            return await Job.countDocuments(query);
        } catch (error) {
            console.log(error);
            throw new Error("Error while finding listed jobs count");
        }
    };

    async getJobs(currentUserId, searchWith = null, page = null, pageSize = null) {
        try {
            const pipeline = [];

            if (currentUserId !== "undefined") {
                pipeline.push({
                    $match: {
                        userId: { $ne: new ObjectId(currentUserId) }
                    }
                });
            }

            pipeline.push(
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
            );

            if (page && pageSize) {
                pipeline.push(
                    {
                        $skip: (page - 1) * pageSize
                    },
                    {
                        $limit: pageSize
                    }
                );
            }

            if (searchWith) {
                // Create a new $match stage for search condition
                pipeline.push({
                    $match: {
                        $or: [
                            { title: { $regex: searchWith, $options: "i" } },
                            { description: { $regex: searchWith, $options: "i" } },
                        ],
                    },
                });
            }

            return await Job.aggregate(pipeline);
        } catch (error) {
            console.log(error);
            throw new Error("Error while finding jobs");
        }
    };


    async getListedJobsCount(id) {
        try {
            return await Job.countDocuments({ userId: id });
        } catch (error) {
            console.log(error);
            throw new Error("Error while finding listed jobs count");
        }
    };

    async getListedJobs(id, page, pageSize) {
        try {
            return await Job.find({ userId: id })
                .skip((page - 1) * pageSize)
                .limit(pageSize);
        } catch (error) {
            console.log(error);
            throw new Error("Error while finding listed jobs");
        }
    };

    async getApplicants(jobId, fieldName) {
        try {
            const jobDocument = await Job.findById(jobId).populate({
                path: "fields.applicants.userId",
                model: "user",
                select: "username profile",
            });

            if (!jobDocument) {
                throw new Error("Job not found");
            }

            const specificField = jobDocument.fields.find(field => field.name === fieldName);

            if (!specificField) {
                throw new Error(`Field "${fieldName}" not found in the job`);
            }

            const { applicants } = specificField;

            return applicants;
        } catch (error) {
            console.log(error.message);
            throw new Error("Error while finding job applicants");
        }
    };

    async takeApplicantAction(job, fieldNameParam, laborerId, action) {
        try {
            const jobIdObject = new ObjectId(job);
            const fieldName = fieldNameParam;
            const laborerIdObject = new ObjectId(laborerId);
            const newStatus = action;

            return await Job.updateOne(
                {
                    _id: jobIdObject,
                    'fields.name': fieldName,
                    'fields.applicants.userId': laborerIdObject
                },
                {
                    $set: {
                        'fields.$[outer].applicants.$[inner].status': newStatus
                    }
                },
                {
                    arrayFilters: [
                        { 'outer.name': fieldName },
                        { 'inner.userId': laborerIdObject }
                    ]
                }
            );
        } catch (error) {
            console.log(error.message);
            throw new Error("Error while taking applican action");
        }
    };

    async getJob(id) {
        try {
            const job = await Job.aggregate([
                {
                    $match: {
                        _id: new ObjectId(id),
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

    async getWorksDoneCount(id) {
        try {
            return await Job.countDocuments({
                "fields.applicants": {
                    $elemMatch: {
                        userId: id
                    }
                }
            });
        } catch (error) {
            console.log(error);
            throw new Error("Error while finding listed jobs count");
        }
    };

    async getWorksHistory(id, page, pageSize) {
        try {
            return await Job.find({
                "fields.applicants": {
                    $elemMatch: {
                        userId: id
                    }
                }
            })
                .skip((page - 1) * pageSize)
                .limit(pageSize);;
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

    async jobPostToApply(id) {
        try {
            return await Job.findById(id);
        } catch (error) {
            console.log(error);
            throw new Error("Error while finding job");
        }
    };

};

module.exports = new JobRepository();
