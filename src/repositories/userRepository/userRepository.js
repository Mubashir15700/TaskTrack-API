const User = require("../../models/userModel");
const Banner = require("../../models/bannerModel");
const Job = require("../../models/jobPostModel");

class UserRepository {
    async getBanners() {
        try {
            return await Banner.find({ isActive: true });
        } catch (error) {
            console.error(error);
            throw new Error("Error while finding banners");
        }
    };

    async updateUser(id, updateObject) {
        try {
            return await User.findByIdAndUpdate(
                id,
                {
                    $set: {
                        ...updateObject,
                    }
                },
                { new: true }
            ).select("-password");
        } catch (error) {
            console.error(error);
            throw new Error("Error while updating profile");
        }
    };

    async deleteProfileImage(id) {
        try {
            return await User.findByIdAndUpdate(
                id,
                {
                    $unset: {
                        profile: 1,
                    },
                },
                { new: true }
            ).select("-password");
        } catch (error) {
            console.error(error);
            throw new Error("Error while deleting profile");
        }
    };

    async deleteCurrentLocation(id) {
        try {
            return await User.findByIdAndUpdate(
                id,
                {
                    $unset: {
                        location: 1,
                    },
                },
                { new: true }
            );
        } catch (error) {
            console.error(error);
            throw new Error("Error while deleting profile");
        }
    };

    async getLaborers() {
        try {
            return await User.find({ isJobSeeker: true }).select("-password");
        } catch (error) {
            console.log(error);
            throw new Error("Error while finding laborers");
        }
    };

    async getLaborer(id) {
        try {
            return await User.findById(id).select("-password");
        } catch (error) {
            console.log(error);
            throw new Error("Error while finding the laborer");
        }
    };

    async getJobs() {
        try {
            return await Job.find();
        } catch (error) {
            console.log(error);
            throw new Error("Error while finding jobs");
        }
    };

    async getJob(id) {
        try {
            return await Job.findById(id);
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
};

module.exports = new UserRepository();