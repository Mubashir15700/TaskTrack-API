const laborerRepository = require("../../repositories/userRepository/laborerRepository");
const profileRepository = require("../../repositories/userRepository/profileRepository");

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
};

module.exports = new LaborerService();
