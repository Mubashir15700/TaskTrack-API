const User = require('../models/userModel');

exports.findUsersPaginated = async (startIndex, itemsPerPage) => {
    try {
        const users = await User.find().skip(startIndex).limit(itemsPerPage);
        return await User.find().skip(startIndex).limit(itemsPerPage).select('-password');
    } catch (error) {
        console.error(error);
        throw new Error('Error while fetching paginated users');
    }
};

exports.findUsersCount = async () => {
    try {
        return await User.countDocuments();
    } catch (error) {
        console.error(error);
        throw new Error("Error while fetching user's count");
    }
};

exports.findUserById = async (id) => {
    return await User.findById(id).select('-password');
};