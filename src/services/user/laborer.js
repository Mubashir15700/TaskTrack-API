const laborerRepository = require("../../repositories/laborer");
const profileRepository = require("../../repositories/profile");

class LaborerService {
    async getLaborers() {
        try {
            const laborers = await laborerRepository.getLaborers();

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
            const laborer = await laborerRepository.getLaborer(id);

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
            console.log(error);
            return {
                status: 500, message: `Internal Server Error: ${error.message}`
            };
        }
    };

    async getPrevRequest(userId) {
        try {
            const request = await laborerRepository.getPrevRequest(userId);

            return {
                status: 201,
                message: "found prev become laborer request",
                data: {
                    request
                }
            };
        } catch (error) {
            console.log(error);
            return {
                status: 500, message: `Internal Server Error: ${error.message}`
            };
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
            console.log(error);
            return {
                status: 500, message: `Internal Server Error: ${error.message}`
            };
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
            console.log(error);
            return {
                status: 500, message: `Internal Server Error: ${error.message}`
            };
        }
    };
};

module.exports = new LaborerService();
