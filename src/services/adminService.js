const adminRepository = require('../repositories/adminRepository');

exports.getUsers = async (itemsPerPage, currentPage) => {
    try {
        const startIndex = (currentPage) * itemsPerPage;

        const users = await adminRepository.findUsersPaginated(startIndex, itemsPerPage);

        if (!users.length) {
            return { status: 400, message: 'No users found' };
        }

        const totalUsers = await adminRepository.findUsersCount();
        const totalPages = Math.ceil(totalUsers / itemsPerPage);

        return {
            status: 201,
            message: `Found users`,
            users,
            totalPages
        };
    } catch (error) {
        console.log(error);
        return { status: 500, message: 'Internal Server Error' };
    }
};

exports.getUser = async (id) => {
    try {
        const user = await adminRepository.findUserById(id);

        if (!user) {
            return { status: 400, message: 'No user found' };
        }

        return {
            status: 201,
            message: `Found user`,
            user,
        };
    } catch (error) {
        console.log(error);
        return { status: 500, message: 'Internal Server Error' };
    }
};