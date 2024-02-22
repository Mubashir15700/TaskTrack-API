const Admin = require("../models/admin");
const User = require("../models/user");
const repositoryErrorHandler = require("../utils/errorHandling/repositoryErrorHandler");

class AuthRepository {
    // check auth
    async findAdminById(id) {
        try {
            return await Admin.findById(id).select("-password");
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };

    async findCurrentUserById(id) {
        try {
            return await User.findById(id).select("-password");
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };

    // admin login
    async findAdminByUserName(username) {
        try {
            return await Admin.findOne({ username });
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };

    // user sign up
    async checkExistingUsername(username) {
        try {
            return await User.findOne({ username });
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };

    async checkExistingEmail(email) {
        try {
            return await User.findOne({ email });
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };

    async createUser(username, email, phone, hashPassword, generatedOTP) {
        try {
            const newUser = new User({
                username,
                email,
                phone,
                password: hashPassword,
                otp: generatedOTP,
            });

            return await newUser.save();
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };

    // user login
    async findUserByUsername(username) {
        try {
            return await User.findOne({ username });
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };

    async findUserByEmail(email) {
        try {
            return await User.findOne({ email });
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };

    // verify otp
    async findUserByOtp(otp) {
        try {
            return await User.findOne({ otp });
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };

    async findUserAndVerify(email) {
        try {
            return await User.findOneAndUpdate(
                { email },
                { $set: { isVerified: true } },
                { new: true }
            );
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };

    // resend otp
    async findUserAndUpdateOtp(email, newOtp) {
        try {
            return await User.findOneAndUpdate(
                { email },
                { $set: { otp: newOtp } },
                { new: true }
            );
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };

    // reset password
    async findUserById(id) {
        try {
            return await User.findById(id);
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };

    async updateUserPassword(userId, newPassword) {
        try {
            const user = await User.findById(userId);
            user.password = newPassword;
            await user.save();
        } catch (error) {
            repositoryErrorHandler(error);
        }
    };

};

module.exports = new AuthRepository();