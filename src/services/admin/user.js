const userRepository = require("../../repositories/user");
const laborerRepository = require("../../repositories/laborer");

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
                status: 201,
                message: "Found users",
                data: {
                    users,
                    totalPages
                }
            };
        } catch (error) {
            console.log(error);
            return {
                status: 500, message: `Internal Server Error: ${error.message}`
            };
        }
    };

    async getUser(id) {
        try {
            const user = await userRepository.findUserById(id);

            if (!user) {
                return { status: 400, message: "No user found" };
            }

            return {
                status: 201,
                message: `Found user`,
                data: {
                    user,
                }
            };
        } catch (error) {
            console.log(error);
            return {
                status: 500, message: `Internal Server Error: ${error.message}`
            };
        }
    };

    async blockUnblockUser(id) {
        try {
            const updatedUser = await userRepository.blockUnblockUser(id);

            if (!updatedUser) {
                return { status: 400, message: "No user found" };
            }

            return {
                status: 201,
                message: "Updated user"
            };
        } catch (error) {
            console.log(error);
            return {
                status: 500, message: `Internal Server Error: ${error.message}`
            };
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
                status: 201,
                message: "Found requests",
                data: {
                    requests,
                    totalPages
                }
            };
        } catch (error) {
            console.log(error);
            return {
                status: 500, message: `Internal Server Error: ${error.message}`
            };
        }
    };

    async getRequest(id) {
        try {
            const request = await laborerRepository.getRequest(id);

            if (!request) {
                return { status: 400, message: "No request found" };
            }

            return {
                status: 201,
                message: "Found request",
                data: {
                    request
                }
            };
        } catch (error) {
            console.log(error);
            return {
                status: 500, message: `Internal Server Error: ${error.message}`
            };
        }
    };

    async approveRejectAction(id, type) {
        try {
            let newStatus;
            if (type === "approve") {
                newStatus = "approved";
            } else if (type === "reject") {
                newStatus = "rejected";
            }

            const updatedRequest = await laborerRepository.approveRejectAction(id, newStatus);

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
            }

            return {
                status: 201,
                message: "Updated request"
            };
        } catch (error) {
            console.log(error);
            return {
                status: 500, message: `Internal Server Error: ${error.message}`
            };
        }
    };
};

module.exports = new UserService();
