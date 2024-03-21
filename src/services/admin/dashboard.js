class DashboardService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    };

    async getData() {
        const foundData = await this.userRepository.findUsersCount();
        
        return {
            status: 200,
            message: "found data successfully",
            data: { foundData }
        };
    };
};

module.exports = DashboardService;
