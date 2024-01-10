const userRepository = require("../../repositories/adminRepository/userRepository");
const bannerRepository = require("../../repositories/adminRepository/bannerRepository");
const planRepository = require("../../repositories/adminRepository/planRepository");

class AdminService {
    async search(searchWith, searchOn) {
        try {
            let searchResults;
            if (searchOn === "employers") {
                searchResults = await userRepository.searchEmployers(searchWith);
            } else if (searchOn === "laborers") {
                searchResults = await userRepository.searchLaborers(searchWith);
            } else if (searchOn === "plans") {
                searchResults = await planRepository.searchPlans(searchWith);
            } else {
                searchResults = await bannerRepository.searchBanners(searchWith);
            }

            return {
                status: 201,
                message: "Search success",
                data: {
                    result: searchResults
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

module.exports = new AdminService();
