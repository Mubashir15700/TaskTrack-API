const User = require('../models/userModel');
const Admin = require('../models/adminModel');

// check auth
exports.findAdminById = async (id) => {
    return await Admin.findById(id).select('-password');
};

exports.findCurrentUserById = async (id) => {
    return await User.findById(id).select('-password');
};

// admin login
exports.findAdminByUserName = async (username) => {
    return await Admin.findOne({ username });
};

// user sign up
exports.checkExistingUsername = async (username) => {
    return await User.findOne({ username });
};

exports.checkExistingEmail = async (email) => {
    return await User.findOne({ email });
};

exports.createUser = async (username, email, phone, hashPassword, generatedOTP) => {
    const newUser = new User({
        username,
        email,
        phone,
        password: hashPassword,
        otp: generatedOTP,
    });

    return await newUser.save();
};

// user login
exports.findUserByUsername = async (username) => {
    return await User.findOne({ username });
};

// verify otp
exports.findUserByOtp = async (otp) => {
    return await User.findOne({ otp });
};

exports.findUserAndVerify = async (email) => {
    return await User.findOneAndUpdate(
        { email },
        { $set: { isVerified: true } },
        { new: true }
    );
};

// resend otp
exports.findUserAndUpdateOtp = async (email, newOtp) => {
    return await User.findOneAndUpdate(
        { email },
        { $set: { otp: newOtp } },
        { new: true }
    );
};

// reset password
exports.findUserById = async (id) => {
    return await User.findById(id);
};

exports.updateUserPassword = async (userId, newPassword) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }

    user.password = newPassword;
    await user.save();
};

// logout
exports.clearUserCookie = (res) => {
    res.clearCookie("userJwt");
};

exports.clearAdminCookie = (res) => {
    res.clearCookie("adminJwt");
};