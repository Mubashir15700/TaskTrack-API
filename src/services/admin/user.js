class UserService {
    constructor(userRepository, laborerRepository, requestRepository, reasonRepository) {
        this.userRepository = userRepository;
        this.laborerRepository = laborerRepository;
        this.requestRepository = requestRepository;
        this.reasonRepository = reasonRepository;
    };

    async getUsers(itemsPerPage, currentPage) {
        const startIndex = (currentPage) * itemsPerPage;
        const users = await this.userRepository.findUsersPaginated(startIndex, itemsPerPage);
        const totalUsers = await this.userRepository.findUsersCount();
        const totalPages = Math.ceil(totalUsers / itemsPerPage);

        return {
            status: 200,
            message: "Found users",
            data: {
                users,
                totalPages
            }
        };
    };

    async getUser(id) {
        const user = await this.userRepository.findUserById(id);

        if (!user) {
            return { status: 404, message: "No user found" };
        }

        return {
            status: 200,
            message: "Found user",
            data: {
                user,
            }
        };
    };

    async blockUnblockUser(id, reason) {
        const updatedBlockStatus = await this.userRepository.blockUnblockUser(id);

        if (!updatedBlockStatus) {
            return { status: 404, message: "No user found" };
        }

        if (updatedBlockStatus.blockStatus) {
            await this.reasonRepository.saveBlockReason(id, "admin_block_user", reason);
        } else {
            await this.reasonRepository.removeBlockReason(id, "admin_block_user");
        }

        return {
            status: 200,
            message: "Updated user"
        };
    };

    async getRequests(itemsPerPage, currentPage) {
        const startIndex = (currentPage) * itemsPerPage;
        const requests = await this.requestRepository.getRequests(startIndex, itemsPerPage);
        const totalRequests = await this.requestRepository.findRequestsCount();
        const totalPages = Math.ceil(totalRequests / itemsPerPage);

        return {
            status: 200,
            message: "Found requests",
            data: {
                requests,
                totalPages
            }
        };
    };

    async getRequest(id) {
        const request = await this.requestRepository.getRequest(id);

        if (!request) {
            return { status: 404, message: "No request found" };
        }

        return {
            status: 200,
            message: "Found request",
            data: {
                request
            }
        };
    };

    async approveRejectAction(requestId, userId, type, reason) {
        let newStatus;
        if (type === "approve") {
            newStatus = "approved";
        } else if (type === "reject") {
            newStatus = "rejected";
        }

        const updatedRequest = await this.requestRepository.approveRejectAction(requestId, newStatus);

        if (!updatedRequest) {
            return { status: 404, message: "No request found" };
        }

        if (newStatus === "approved") {
            // Extract specific properties from updatedRequest
            const { userId, languages, education, avlDays, avlTimes, fields } = updatedRequest;

            // Save the updatedRequest into the laborer collection
            const savedLaborer = await this.laborerRepository.saveLaborerDetails({
                userId, languages, education, avlDays, avlTimes, fields
            });

            if (!savedLaborer) {
                return { status: 500, message: "Failed to save laborer details" };
            }

            const updatedUser = await this.userRepository.changeToJobSeeker(updatedRequest.userId);

            if (!updatedUser) {
                return { status: 500, message: "Failed to update user" };
            }

            await this.reasonRepository.removeBlockReason(
                userId,
                "admin_reject_laborer_request",
            );

        } else {
            await this.reasonRepository.saveBlockReason(
                userId,
                "admin_reject_laborer_request",
                reason
            );
        }

        return {
            status: 200,
            message: "Updated request"
        };
    };
};

module.exports = UserService;
