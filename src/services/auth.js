const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const authRepository = require("../repositories/auth");
const generateAndSendOtp = require("../utils/email/generateAndSendOtp");
const serverErrorHandler = require("../utils/errorHandling/serverErrorHandler");

const TOKEN_EXPIRATION_DURATION = "7d";

async function sendVerificationEmailAndOtp(email, successMessage, errorMessage) {
    try {
        // Send verification email
        await generateAndSendOtp(email);

        return {
            status: 201,
            message: successMessage
        };
    } catch (error) {
        return serverErrorHandler(errorMessage, error);
    }
};

class AuthService {
    async decodeToken(token) {
        return jwt.verify(token, process.env.JWT_SECRET_KEY);
    };

    async checkAuth(token, role) {
        try {
            if (!token) {
                return { status: 401, success: false, message: `Unauthorized ${role}` };
            }

            const decoded = await this.decodeToken(token);

            let currentUser;
            if (decoded.role === "admin") {
                currentUser = await authRepository.findAdminById(decoded.adminId);
            } else {
                currentUser = await authRepository.findCurrentUserById(decoded.userId);
            }

            if (!currentUser) {
                return { status: 401, success: false, message: "User not found" };
            }

            return {
                status: 201,
                message: `Authorized ${decoded.role}`,
                data: {
                    currentUser,
                    role: decoded.role,
                },
            };
        } catch (error) {
            return serverErrorHandler("An error occurred during user authentication: ", error);
        }
    };

    async adminLogin(username, password) {
        try {
            if (!username || !password) {
                return { status: 401, success: false, message: "All fields are required" };
            }

            const admin = await authRepository.findAdminByUserName(username);

            if (!admin) {
                return { status: 401, success: false, message: "Invalid credentials" };
            }

            const isMatch = await bcrypt.compare(password, admin.password);

            if (isMatch) {
                // Generate JWT Token
                const token = jwt.sign(
                    { adminId: admin._id, role: "admin" },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: TOKEN_EXPIRATION_DURATION }
                );

                // Create a admin object without the password field
                const adminDataToSend = {
                    _id: admin._id,
                    username: admin.username,
                };

                return {
                    status: 201,
                    message: "Logged in successfully",
                    data: {
                        token,
                        currentUser: adminDataToSend,
                    }
                };
            } else {
                return { status: 400, success: false, message: "Invalid username or password" };
            }
        } catch (error) {
            return serverErrorHandler("An error occurred during admin login: ", error);
        }
    };

    async signUp(username, email, phone, password, confirmPassword) {
        try {
            // Check if the username is already taken
            const existingUsername = await authRepository.checkExistingUsername(
                username
            );
            if (existingUsername) {
                return { status: 400, success: false, message: "This username is already taken" };
            }

            // Check if the email is already registered
            const existingEmail = await authRepository.checkExistingEmail(email);
            if (existingEmail) {
                return { status: 400, success: false, message: "This email is already registered" };
            }

            // Check if password and confirm password match
            if (password !== confirmPassword) {
                return {
                    status: 400,
                    success: false,
                    message: "Password and confirm password don't match"
                };
            }

            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);

            // Create user in the repository
            const user = await authRepository.createUser(
                username, email, phone, hashPassword
            );

            // Generate JWT Token
            const token = jwt.sign(
                { userId: user._id, role: "user" },
                process.env.JWT_SECRET_KEY,
                { expiresIn: TOKEN_EXPIRATION_DURATION }
            );

            // Send verification email
            await generateAndSendOtp(email);

            return {
                status: 201,
                message: "Registered user successfully",
                data: {
                    token,
                    currentUser: user
                }
            };
        } catch (error) {
            return serverErrorHandler("An error occurred during user registration: ", error);
        }
    };

    async userLogin(username, password) {
        try {
            if (!username || !password) {
                return { status: 400, success: false, message: "All fields are required" };
            }

            const user = await authRepository.findUserByUsername(username);

            if (!user) {
                return { status: 401, success: false, message: "Invalid credentials" };
            }

            if (user.isBlocked) {
                return { status: 401, success: false, message: "Your account has been blocked" };
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                // Generate JWT Token
                const token = jwt.sign(
                    { userId: user._id, role: "user" },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: TOKEN_EXPIRATION_DURATION }
                );

                // Create a user object without the password field
                const userDataToSend = {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    phone: user.phone,
                    isJobSeeker: user.isJobSeeker,
                    isBlocked: user.isBlocked,
                    isVerified: user.isVerified,
                    location: user.location,
                };

                return {
                    status: 201,
                    message: "Logged in successfully",
                    data: {
                        token,
                        currentUser: userDataToSend,
                    }
                };
            } else {
                return { status: 401, message: "Invalid username or password" };
            }
        } catch (error) {
            return serverErrorHandler("An error occurred during user login: ", error);
        }
    };

    async verifyOtp(otp, email) {
        try {
            const user = await authRepository.findUserByOtp(otp);

            if (!user) {
                return { status: 400, success: false, message: "Invalid" };
            } else {
                const verifiedUser = await authRepository.findUserAndVerify(email);
                if (verifiedUser && verifiedUser.isVerified) {
                    // Generate JWT Token
                    const token = jwt.sign(
                        { userId: user._id, role: "user" },
                        process.env.JWT_SECRET_KEY,
                        { expiresIn: TOKEN_EXPIRATION_DURATION }
                    );

                    return {
                        status: 201,
                        message: "You are verified",
                        data: {
                            token,
                        }
                    };
                } else {
                    return { status: 400, success: false, message: "Invalid" };
                }
            };
        } catch (error) {
            return serverErrorHandler("An error occurred during otp verification: ", error);
        }
    };

    async resendOtp(email) {
        return sendVerificationEmailAndOtp(email, "OTP resent successfully", "An error occurred during otp resending:");
    };

    async confirmEmail(email) {
        return sendVerificationEmailAndOtp(email, "OTP sent successfully", "An error occurred during confirming email:");
    };

    async resetPassword(userId, password, confirmPassword) {
        try {
            if (password !== confirmPassword) {
                return { status: 400, success: false, message: "Passwords do not match" };
            }

            const user = await authRepository.findUserById(userId);

            if (!user) {
                return { status: 400, success: false, message: "User not found" };
            }

            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);

            await authRepository.updateUserPassword(userId, hashPassword);

            return {
                status: 201,
                message: "Password reset successfully"
            };
        } catch (error) {
            return serverErrorHandler("An error occurred during password resetting: ", error);
        }
    };
};

module.exports = new AuthService();
