const userRepository = require("../repositories/user");
const laborerRepository = require("../repositories/laborer");
const jobRepository = require("../repositories/job");
const bannerRepository = require("../repositories/banner");
const planRepository = require("../repositories/plan");
const serverErrorHandler = require("../utils/errorHandling/serverErrorHandler");

class AdminService {
    async search(currentUserId, searchWith, searchOn) {
        try {
            let searchResults;
            if (searchOn === "employers") {
                searchResults = await userRepository.searchEmployers(searchWith);
            } else if (searchOn === "laborers") {
                searchResults = await laborerRepository.searchLaborers(searchWith);
            } else if (searchOn === "plans") {
                searchResults = await planRepository.searchPlans(searchWith);
            } else if (searchOn === "jobs") {
                searchResults = await jobRepository.getJobs(currentUserId, searchWith);
            } else {
                searchResults = await bannerRepository.searchBanners(searchWith);
            }
            console.log(searchResults);
            return {
                status: 201,
                message: "Search success",
                data: {
                    result: searchResults
                }
            };
        } catch (error) {
            return serverErrorHandler(`An error occurred during searching: ${searchOn}`, error);
        }
    };
};

module.exports = new AdminService();
