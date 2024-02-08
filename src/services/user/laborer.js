const laborerRepository = require("../../repositories/laborer");
const profileRepository = require("../../repositories/profile");
const reasonRepository = require("../../repositories/reason");
const serverErrorHandler = require("../../utils/errorHandling/serverErrorHandler");

class LaborerService {
    async getLaborers(userId, page) {
        try {
            const pageSize = 10;

            const laborers = await laborerRepository.getLaborers(userId, null, page, pageSize);
            const totalLaborers = await laborerRepository.getLaborersCount(userId);
            const totalPages = Math.ceil(totalLaborers / pageSize);

            return {
                status: 201,
                message: "get laborers success",
                data: {
                    laborers,
                    totalPages
                }
            };
        } catch (error) {
            return serverErrorHandler("An error occurred during fetching laborers: ", error);
        }
    };

    async getLaborer(id) {
        try {
            const laborer = await laborerRepository.getLaborer(id);

            return {
                status: 201,
                message: "get laborer success",
                data: {
                    laborer
                }
            };
        } catch (error) {
            return serverErrorHandler("An error occurred during fetching laborer: ", error);
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
                status: 201,
                message: "send become laborer request success"
            };
        } catch (error) {
            return serverErrorHandler("An error occurred during sebding request: ", error);
        }
    };

    async getPrevRequest(userId) {
        try {
            console.log(userId);
            const request = await laborerRepository.getPrevRequest(userId);
            
            const data = {
                request
            };

            if (request.status === "rejected") {
                const rejectReason = await reasonRepository.findBlockReason(
                    userId, "admin_reject_laborer_request"
                );
                console.log(rejectReason);
                data.reason = rejectReason.reason;
            }

            return {
                status: 201,
                message: "found prev become laborer request",
                data
            };
        } catch (error) {
            return serverErrorHandler("An error occurred during fetching previous requests: ", error);
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
                status: 201,
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
            return serverErrorHandler("An error occurred during updating request: ", error);
        }
    };

    async cancelRequest(userId) {
        try {
            const cancelResult = await laborerRepository.cancelRequest(userId);

            return {
                status: 201,
                message: "cancel become laborer request success",
                data: {
                    cancelResult,
                }
            };
        } catch (error) {
            return serverErrorHandler("An error occurred during cancelling request: ", error);
        }
    };
};

module.exports = new LaborerService();
