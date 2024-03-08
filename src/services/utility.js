const { getBannersWithPresignedUrls } = require("../utils/getBannersWithImageUrls");

class UtilityService {
    constructor(userRepository, laborerRepository, jobRepository, bannerRepository, planRepository) {
        this.userRepository = userRepository;
        this.laborerRepository = laborerRepository;
        this.jobRepository = jobRepository;
        this.bannerRepository = bannerRepository;
        this.planRepository = planRepository;
    };

    async search(currentUserId, searchWith, searchOn) {
        let searchResults;
        if (searchOn === "users") {
            searchResults = await this.userRepository.searchUsers(searchWith);
        } else if (searchOn === "laborers") {
            searchResults = await this.laborerRepository.getLaborers(currentUserId, searchWith);
        } else if (searchOn === "plans") {
            searchResults = await this.planRepository.searchPlans(searchWith);
        } else if (searchOn === "jobs") {
            searchResults = await this.jobRepository.getJobs(currentUserId, searchWith);
        } else {
            const foundBanners = await this.bannerRepository.searchBanners(searchWith);
            searchResults = await getBannersWithPresignedUrls(foundBanners);
        }

        return {
            status: 200,
            message: "Search success",
            data: {
                result: searchResults
            }
        };
    };
};

module.exports = UtilityService;
