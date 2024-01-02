const userRepository = require('../repositories/userRepository');

class UserService {
    async updateProfile() {
        try {
            console.log("here");
        } catch (error) {
            console.log(error);
            return { status: 500, message: 'Internal Server Error' };
        }
    };
};

module.exports = new UserService();
