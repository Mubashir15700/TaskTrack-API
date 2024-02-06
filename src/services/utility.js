const userRepository = require("../repositories/user");
const laborerRepository = require("../repositories/laborer");
const jobRepository = require("../repositories/job");
const bannerRepository = require("../repositories/banner");
const planRepository = require("../repositories/plan");
const serverErrorHandler = require("../utils/errorHandling/serverErrorHandler");

class UtilityService {
    async search(currentUserId, searchWith, searchOn) {
        try {
            let searchResults;
            if (searchOn === "users") {
                searchResults = await userRepository.searchUsers(searchWith);
            } else if (searchOn === "laborers") {
                searchResults = await laborerRepository.getLaborers(currentUserId, searchWith);
            } else if (searchOn === "plans") {
                searchResults = await planRepository.searchPlans(searchWith);
            } else if (searchOn === "jobs") {
                searchResults = await jobRepository.getJobs(currentUserId, searchWith);
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
            return serverErrorHandler(`An error occurred during searching: ${searchOn}`, error);
        }
    };
};

module.exports = new UtilityService();
