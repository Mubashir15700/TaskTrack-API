const Admin = require("../models/admin");
const User = require("../models/user");

class AuthRepository {
    // check auth
    async findAdminById(id) {
        try {
            return await Admin.findById(id).select("-password");
        } catch (error) {
            console.error(error);
            throw new Error("Error while fetching admin");
        }
    };

    async findCurrentUserById(id) {
        try {
            return await User.findById(id).select("-password");
        } catch (error) {
            console.error(error);
            throw new Error("Error while fetching user");
        }
    };

    // admin login
    async findAdminByUserName(username) {
        try {
            return await Admin.findOne({ username });
        } catch (error) {
            console.error(error);
            throw new Error("Error while fetching admin");
        }
    };

    // user sign up
    async checkExistingUsername(username) {
        try {
            return await User.findOne({ username });
        } catch (error) {
            console.error(error);
            throw new Error("Error while checking user exists");
        }
    };

    async checkExistingEmail(email) {
        try {
            return await User.findOne({ email });
        } catch (error) {
            console.error(error);
            throw new Error("Error while checking user exists");
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
            console.error(error);
            throw new Error("Error while creating user");
        }
    };

    // user login
    async findUserByUsername(username) {
        try {
            return await User.findOne({ username });
        } catch (error) {
            console.error(error);
            throw new Error("Error while fetching user");
        }
    };

    // verify otp
    async findUserByOtp(otp) {
        try {
            return await User.findOne({ otp });
        } catch (error) {
            console.error(error);
            throw new Error("Error while fetching user");
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
            console.error(error);
            throw new Error("Error while verifying user");
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
            console.error(error);
            throw new Error("Error while resending otp");
        }
    };

    // reset password
    async findUserById(id) {
        try {
            return await User.findById(id);
        } catch (error) {
            console.error(error);
            throw new Error("Error while reseting password");
        }
    };

    async updateUserPassword(userId, newPassword) {
        try {
            const user = await User.findById(userId);
            user.password = newPassword;
            await user.save();
        } catch (error) {
            console.error(error);
            throw new Error("Error while updating password");
        }
    };

};

module.exports = new AuthRepository();