const { ObjectId } = require("mongoose").Types;
const Job = require("../models/jobPost");

class JobRepository {
    async getJobsCount(id) {
        const query = id === "undefined" ?
            {} : { userId: { $ne: new ObjectId(id) } };
        return await Job.countDocuments(query);
    };

    async getJobs(currentUserId, searchWith = null, page = null, pageSize = null) {
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
    };

    async getListedJobsCount(id) {
        return await Job.countDocuments({ userId: id });
    };

    async getListedJobs(id, page, pageSize) {
        return await Job.find({ userId: id })
            .skip((page - 1) * pageSize)
            .limit(pageSize);
    };

    async getApplicants(jobId, fieldName) {
        const jobDocument = await Job.findById(jobId).populate({
            path: "fields.applicants.userId",
            model: "User",
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
    };

    async takeApplicantAction(job, fieldNameParam, laborerId, action) {
        const jobIdObject = new ObjectId(job);
        const fieldName = fieldNameParam;
        const laborerIdObject = new ObjectId(laborerId);
        const newStatus = action;

        return await Job.updateOne(
            {
                _id: jobIdObject,
                "fields.name": fieldName,
                "fields.applicants.userId": laborerIdObject
            },
            {
                $set: {
                    "fields.$[outer].applicants.$[inner].status": newStatus
                }
            },
            {
                arrayFilters: [
                    { "outer.name": fieldName },
                    { "inner.userId": laborerIdObject }
                ]
            }
        );
    };

    async getJob(id) {
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
    };

    async editJob(jobDetails) {
        const { jobId, title, description, date, time, duration, location, status, fields } = jobDetails;

        return await Job.findByIdAndUpdate(jobId, {
            $set: {
                title, description, date, time, duration, location, status, fields
            }
        }, { new: true });
    };

    async deleteJob(id) {
        return await Job.findByIdAndDelete(id);
    };

    async getWorksDoneCount(id) {
        return await Job.countDocuments({
            "fields.applicants": {
                $elemMatch: {
                    userId: id
                }
            }
        });
    };

    async getWorksHistory(id, page, pageSize) {
        return await Job.find({
            "fields.applicants": {
                $elemMatch: {
                    userId: id
                }
            }
        })
            .skip((page - 1) * pageSize)
            .limit(pageSize);;
    };

    async postJob(jobDetails) {
        const newJob = new Job(jobDetails);
        return await newJob.save();
    };

    async jobPostToApply(id) {
        return await Job.findById(id);
    };
};

module.exports = JobRepository;
