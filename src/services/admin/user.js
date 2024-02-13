const userRepository = require("../../repositories/user");
const laborerRepository = require("../../repositories/laborer");
const reasonRepository = require("../../repositories/reason");
const serverErrorHandler = require("../../utils/errorHandling/serverErrorHandler");

class UserService {
    async getUsers(itemsPerPage, currentPage) {
        try {
            const startIndex = (currentPage) * itemsPerPage;

            const users = await userRepository.findUsersPaginated(startIndex, itemsPerPage);

            if (!users.length) {
                return { status: 400, message: "No users found" };
            }

            const totalUsers = await userRepository.findUsersCount();
            const totalPages = Math.ceil(totalUsers / itemsPerPage);

            return {
                status: 200,
                message: "Found users",
                data: {
                    users,
                    totalPages
                }
            };
        } catch (error) {
            return serverErrorHandler("An error occurred during fetching users: ", error);
        }
    };

    async getUser(id) {
        try {
            const user = await userRepository.findUserById(id);

            if (!user) {
                return { status: 400, message: "No user found" };
            }

            return {
                status: 200,
                message: `Found user`,
                data: {
                    user,
                }
            };
        } catch (error) {
            return serverErrorHandler("An error occurred during fetching user: ", error);
        }
    };

    async blockUnblockUser(id, reason) {
        try {
            const updatedBlockStatus = await userRepository.blockUnblockUser(id);

            if (!updatedBlockStatus) {
                return { status: 400, message: "No user found" };
            }

            if (updatedBlockStatus.blockStatus) {
                await reasonRepository.saveBlockReason(id, "admin_block_user", reason);
            } else {
                await reasonRepository.removeBlockReason(id, "admin_block_user");
            }

            return {
                status: 200,
                message: "Updated user"
            };
        } catch (error) {
            return serverErrorHandler("An error occurred during taking user action: ", error);
        }
    };

    async getRequests(itemsPerPage, currentPage) {
        try {
            const startIndex = (currentPage) * itemsPerPage;

            const requests = await laborerRepository.getRequests(startIndex, itemsPerPage);

            if (!requests.length) {
                return { status: 400, message: "No requests found" };
            }

            const totalRequests = await laborerRepository.findRequestsCount();
            const totalPages = Math.ceil(totalRequests / itemsPerPage);

            return {
                status: 200,
                message: "Found requests",
                data: {
                    requests,
                    totalPages
                }
            };
        } catch (error) {
            return serverErrorHandler("An error occurred during fetching requests: ", error);
        }
    };

    async getRequest(id) {
        try {
            const request = await laborerRepository.getRequest(id);

            if (!request) {
                return { status: 400, message: "No request found" };
            }

            return {
                status: 200,
                message: "Found request",
                data: {
                    request
                }
            };
        } catch (error) {
            return serverErrorHandler("An error occurred during fetching request: ", error);
        }
    };

    async approveRejectAction(requestId, userId, type, reason) {
        try {
            let newStatus;
            if (type === "approve") {
                newStatus = "approved";
            } else if (type === "reject") {
                newStatus = "rejected";
            }

            const updatedRequest = await laborerRepository.approveRejectAction(requestId, newStatus);

            if (!updatedRequest) {
                return { status: 400, message: "No request found" };
            }

            if (newStatus === "approved") {
                // Extract specific properties from updatedRequest
                const { userId, languages, education, avlDays, avlTimes, fields } = updatedRequest;

                // Save the updatedRequest into the laborer collection
                const savedLaborer = await laborerRepository.saveLaborerDetails({
                    userId, languages, education, avlDays, avlTimes, fields
                });

                if (!savedLaborer) {
                    return { status: 500, message: "Failed to save laborer details" };
                }

                const updatedUser = await laborerRepository.changeToJobSeeker(updatedRequest.userId);

                if (!updatedUser) {
                    return { status: 500, message: "Failed to update user" };
                }

                await reasonRepository.removeBlockReason(
                    userId,
                    "admin_reject_laborer_request",
                );

            } else {
                await reasonRepository.saveBlockReason(
                    userId,
                    "admin_reject_laborer_request",
                    reason
                );
            }

            return {
                status: 200,
                message: "Updated request"
            };
        } catch (error) {
            return serverErrorHandler("An error occurred during taking request action: ", error);
        }
    };
};

module.exports = new UserService();
