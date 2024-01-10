const fs = require("fs");
const path = require("path");
const querystring = require("querystring");
const userRepository = require("../../repositories/userRepository/userRepository");

class UserService {
    async getBanners() {
        try {
            const banners = await userRepository.getBanners();

            return {
                status: 201,
                message: "get banners success",
                data: {
                    banners
                }
            };
        } catch (error) {
            console.log(error);
            return {
                status: 500, message: `Internal Server Error: ${error.message}`
            };
        }
    }

    async updateProfile(id, updateObject, profileImage) {
        try {
            if (profileImage) {
                updateObject.profile = profileImage;
            }

            const updateResult = await userRepository.updateUser(id, updateObject);

            return {
                status: 201,
                message: "Update success",
                data: {
                    updatedUser: updateResult
                }
            };
        } catch (error) {
            console.log(error);
            return {
                status: 500, message: `Internal Server Error: ${error.message}`
            };
        }
    };

    async deleteProfileImage(id, image) {
        try {
            const updateResult = await userRepository.deleteProfileImage(id);
            if (updateResult) {
                const imagePath = path.join(__dirname, "../../uploads/", image);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }

            return {
                status: 201,
                message: "Deletd profile image successfully",
                data: {
                    updatedUser: updateResult
                }
            };
        } catch (error) {
            console.log(error);
            return {
                status: 500, message: `Internal Server Error: ${error.message}`
            };
        }
    };

    async getCurrentLocation(lat, lon) {
        try {
            const url = `https://api.opencagedata.com/geocode/v1/json?${querystring.stringify({
                key: process.env.OPENCAGE_API_KEY,
                q: `${lat},${lon}`,
                language: "en",
            })}`;

            const response = await fetch(url);
            const data = await response.json();

            const firstResult = data.results[0];
            const fullAddress = {
                lat,
                lon,
                road: firstResult.components.road || "",
                village: firstResult.components.village || "",
                district: firstResult.components.state_district || "",
                state: firstResult.components.state || "",
                postcode: firstResult.components.postcode || "",
            };

            return {
                status: 201,
                message: "Fetched user location successfully",
                data: {
                    fullAddress
                }
            };
        } catch (error) {
            console.log(error);
            return {
                status: 500, message: `Internal Server Error: ${error.message}`
            };
        }
    };

    async deleteCurrentLocation(userId) {
        try {
            const deleteResult = await userRepository.deleteCurrentLocation(userId);

            if (deleteResult) {
                return {
                    status: 201,
                    message: "Deleted user location successfully",
                    data: {
                        deleteResult
                    }
                };
            }
        } catch (error) {
            console.log(error);
            return {
                status: 500, message: `Internal Server Error: ${error.message}`
            };
        }
    };

    async getLaborers() {
        try {
            const laborers = await userRepository.getLaborers();

            return {
                status: 201,
                message: "get laborers success",
                data: {
                    laborers
                }
            };
        } catch (error) {
            console.log(error);
            return {
                status: 500, message: `Internal Server Error: ${error.message}`
            };
        }
    };

    async getLaborer(id) {
        try {
            const laborer = await userRepository.getLaborer(id);

            return {
                status: 201,
                message: "get laborer success",
                data: {
                    laborer
                }
            };
        } catch (error) {
            console.log(error);
            return {
                status: 500, message: `Internal Server Error: ${error.message}`
            };
        }
    };

    async getJobs() {
        try {
            const jobs = await userRepository.getJobs();

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

    async getJob(id) {
        try {
            const job = await userRepository.getJob(id);

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

    async editJob(jobId, jobDetails) {
        try {
            const { jobId, title, description, date, time, duration, location, fields } = jobDetails;
            if (!title || !description || !date || !time || !duration || !location || !fields) {
                return { status: 400, message: "All fields are required" };
            }

            const editResult = await userRepository.editJob({
                jobId, title, description, date, time, duration, location, fields
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

    async postJob(jobDetails) {
        try {
            const { userId, title, description, date, time, duration, location, fields } = jobDetails;
            if (!title || !description || !date || !time || !duration || !location || !fields) {
                return { status: 400, message: "All fields are required" };
            }

            const postResult = await userRepository.postJob({
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

module.exports = new UserService();
