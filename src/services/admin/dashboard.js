class DashboardService {
    constructor(userRepository, jobRepository, subscriptionRepository) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.subscriptionRepository = subscriptionRepository;
    };

    async getData() {
        const totalUsers = await this.userRepository.findUsersCount();
        const totalJobs = await this.jobRepository.getJobsCount();
        const activeSubscriptions = await this.subscriptionRepository.findSubscriptionsCount();

        const barChartData = await this.subscriptionRepository.getMonthlySubscriptions();
        const doughnutChartData = await this.userRepository.getLaborerEmployerCount();
        
        return {
            status: 200,
            message: "found data successfully",
            data: {
                totalUsers,
                totalJobs,
                activeSubscriptions,
                barChartData,
                doughnutChartData
            }
        };
    };
};

module.exports = DashboardService;
