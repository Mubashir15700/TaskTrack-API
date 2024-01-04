const adminRepository = require("../repositories/adminRepository");

class AdminService {
    async search(searchWith, searchOn) {
        try {
            let searchResults;
            if (searchOn === "employers") {
                searchResults = await adminRepository.searchEmployers(searchWith);
            } else if (searchOn === "laborers") {
                searchResults = await adminRepository.searchLaborers(searchWith);
            } else if (searchOn === "plans") {
                searchResults = await adminRepository.searchPlans(searchWith);
            } else {
                searchResults = await adminRepository.searchBanners(searchWith);
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

    async getUsers(itemsPerPage, currentPage) {
        try {
            const startIndex = (currentPage) * itemsPerPage;

            const users = await adminRepository.findUsersPaginated(startIndex, itemsPerPage);

            if (!users.length) {
                return { status: 400, message: "No users found" };
            }

            const totalUsers = await adminRepository.findUsersCount();
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
            const user = await adminRepository.findUserById(id);

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
            const updatedUser = await adminRepository.blockUnblockUser(id);

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
};

module.exports = new AdminService();
