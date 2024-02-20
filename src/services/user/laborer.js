const laborerRepository = require("../../repositories/laborer");
const profileRepository = require("../../repositories/profile");
const reasonRepository = require("../../repositories/reason");
const calculateDistance = require("../../utils/calculateDistance");
const serverErrorHandler = require("../../utils/errorHandling/serverErrorHandler");

class LaborerService {
    async getLaborers(userId, page, lat, lon) {
        try {
            const pageSize = 10;

            const laborers = await laborerRepository.getLaborers(userId, null, page, pageSize);

            let laborersWithDistances;
            if (lat && lon) {
                // Calculate distances for each laborer
                laborersWithDistances = laborers.map(laborer => {
                    const laborerLat = laborer.location?.latitude;
                    const laborerLon = laborer.location?.longitude;
                    // Check if laborer location exists
                    if (laborerLat !== undefined && laborerLon !== undefined) {
                        const distance = calculateDistance(lat, lon, laborerLat, laborerLon);
                        return { ...laborer, distance };
                    } else {
                        // Handle cases where laborer location is undefined
                        return { ...laborer, distance: Infinity }; // Set distance to Infinity or any other value as desired
                    }
                });

                // Sort laborers based on distance
                laborersWithDistances.sort((a, b) => a.distance - b.distance);
            }

            const totalLaborers = await laborerRepository.getLaborersCount(userId);
            const totalPages = Math.ceil(totalLaborers / pageSize);

            return {
                status: 200,
                message: "get laborers success",
                data: {
                    laborers: (lat && lon) ? laborersWithDistances : laborers,
                    totalPages
                }
            };
        } catch (error) {
            return serverErrorHandler(error.message);
        }
    };

    async getLaborer(id) {
        try {
            const laborer = await laborerRepository.getLaborer(id);

            return {
                status: 200,
                message: "get laborer success",
                data: {
                    laborer
                }
            };
        } catch (error) {
            return serverErrorHandler(error.message);
        }
    };

    async sendRequest(data) {
        try {
            // Cancel previous request if it exists
            await laborerRepository.cancelRequest(data.userId);

            if (Object.keys(data.userData).length) {
                const { id, ...updateObject } = data.userData;
                // Now, updateObject contains all properties except id
                await profileRepository.updateUser(data.userData.id, updateObject);
            }

            // Extract userData from data
            const { userData, ...restOfData } = data;
            // Now, restOfData contains everything except userData
            await laborerRepository.saveRequest(restOfData);

            return {
                status: 200,
                message: "send become laborer request success"
            };
        } catch (error) {
            return serverErrorHandler(error.message);
        }
    };

    async getPrevRequest(userId) {
        try {
            const request = await laborerRepository.getPrevRequest(userId);

            const data = {
                request
            };

            if (request.status === "rejected") {
                const rejectReason = await reasonRepository.findBlockReason(
                    userId, "admin_reject_laborer_request"
                );
                data.reason = rejectReason.reason;
            }

            return {
                status: 200,
                message: "found prev become laborer request",
                data
            };
        } catch (error) {
            return serverErrorHandler(error.message);
        }
    };

    async updateRequest(data) {
        try {
            let updatedProfile;
            if (Object.keys(data.userData).length) {
                const { id, ...updateObject } = data.userData;
                // Now, updateObject contains all properties except id
                updatedProfile = await profileRepository.updateUser(data.userData.id, updateObject);
            }

            // Extract userData from data
            const { userData, ...restOfData } = data;
            // Now, restOfData contains everything except userData

            const updatedRequest = await laborerRepository.updateRequest({ ...restOfData, status: "pending" });

            const response = {
                status: 200,
                message: "send become laborer request success",
                data: {
                    updatedRequest,
                }
            };

            // Check if updatedProfile has values before adding it to the response
            if (updatedProfile && Object.keys(updatedProfile).length) {
                response.data.updatedProfile = updatedProfile;
            }

            return response;
        } catch (error) {
            return serverErrorHandler(error.message);
        }
    };

    async cancelRequest(userId) {
        try {
            const cancelResult = await laborerRepository.cancelRequest(userId);

            return {
                status: 200,
                message: "cancel become laborer request success",
                data: {
                    cancelResult,
                }
            };
        } catch (error) {
            return serverErrorHandler(error.message);
        }
    };
};

module.exports = new LaborerService();
