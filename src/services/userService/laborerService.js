const laborerRepository = require("../../repositories/userRepository/laborerRepository");

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
};

module.exports = new LaborerService();
