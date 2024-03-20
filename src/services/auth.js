const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const generateAndSendOtp = require("../utils/email/generateAndSendOtp");
const generateToken = require("../utils/generateJwt");

async function sendVerificationEmailAndOtp(email, successMessage, errorMessage) {
    // Send verification email
    await generateAndSendOtp(email, errorMessage);

    return {
        status: 200,
        message: successMessage
    };
};

class AuthService {
    constructor(adminRepository, userRepository, reasonRepository) {
        this.adminRepository = adminRepository;
        this.userRepository = userRepository;
        this.reasonRepository = reasonRepository
    };

    async decodeToken(token) {
        return jwt.verify(token, process.env.JWT_SECRET_KEY);
    };

    async checkAuth(token, role) {
        if (!token) {
            return { status: 401, message: `Unauthorized ${role} - Missing JWT` };
        }

        const decoded = await this.decodeToken(token);

        let currentUser;
        if (decoded.role === "admin") {
            currentUser = await this.adminRepository.findAdminById(decoded.userId);
        } else {
            currentUser = await this.userRepository.findCurrentUserById(decoded.userId);
        }

        if (!currentUser) {
            return { status: 404, message: "User not found" };
        }

        return {
            status: 200,
            message: `Authorized ${decoded.role}`,
            data: {
                currentUser,
                role: decoded.role,
            },
        };
    };

    async login(username, password = null, role) {
        if (!username || !password) {
            return { status: 400, message: "All fields are required" };
        }

        let currentUser;
        if (role === "admin") {
            currentUser = await this.adminRepository.findAdminByUserName(username);
        } else {
            currentUser = await this.userRepository.findUserByUsername(username);

            if (currentUser && currentUser.isBlocked) {
                const blockReason = await this.reasonRepository.findBlockReason(
                    currentUser._id, "admin_block_user"
                );

                return {
                    status: 403,
                    success: false,
                    message: `Your account has been blocked. ${blockReason.reason}`
                };
            }
        }

        if (!currentUser) {
            return { status: 401, message: "Invalid credentials" };
        }

        const isMatch = await bcrypt.compare(password, currentUser.password);

        if (isMatch) {
            // Generate JWT Token
            const token = await generateToken(currentUser._id, role);

            // Omitting passowrd from the "currentUser" object
            const userDataWithoutPassword = { ...currentUser._doc, password: undefined };

            return {
                status: 200,
                message: "Logged in successfully",
                data: {
                    token,
                    currentUser: userDataWithoutPassword,
                }
            };
        } else {
            return { status: 401, message: "Invalid username or password" };
        }
    };

    async signUp(data) {
        // Validate required fields
        const requiredFields = [
            "username", "email", "phone", "password", "confirmPassword"
        ];
        if (!requiredFields.every(field => data[field])) {
            return { status: 400, message: "All fields are required" };
        }

        const { username, email, phone, password, confirmPassword } = data;

        // Check if the username is already taken
        const existingUsername = await this.userRepository.checkExistingUsername(username);
        if (existingUsername) {
            return { status: 409, message: "This username is already taken" };
        }

        // Check if the email is already registered
        const existingEmail = await this.userRepository.checkExistingEmail(email);
        if (existingEmail) {
            return { status: 409, message: "This email is already registered" };
        }

        // Check if password and confirm password match
        if (password !== confirmPassword) {
            return { status: 400, message: "Password and confirm password don't match" };
        };

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // Create user in the repository
        const user = await this.userRepository.createUser(
            username, email, phone, hashPassword
        );

        // Send verification email
        await generateAndSendOtp(email);

        return {
            status: 200,
            message: "Registered user successfully",
            data: {
                currentUser: user
            }
        };
    };

    async verifyOtp(otp, email) {
        const user = await this.userRepository.findUserByOtp(otp);

        if (!user) {
            return { status: 404, message: "Invalid OTP" };
        } else {
            const verifiedUser = await this.userRepository.findUserAndVerify(email);
            if (verifiedUser && verifiedUser.isVerified) {
                // Generate JWT Token
                const token = await generateToken(user._id, "user");

                return {
                    status: 200,
                    message: "You are verified",
                    data: {
                        token,
                    }
                };
            } else {
                return { status: 401, message: "Invalid user or not verified" };
            }
        }
    };

    async resendOtp(email) {
        return sendVerificationEmailAndOtp(email, "OTP resent successfully", "An error occurred during otp resending:");
    };

    async confirmEmail(email) {
        return sendVerificationEmailAndOtp(email, "OTP sent successfully", "An error occurred during confirming email:");
    };

    async resetPassword(userId, password, confirmPassword) {
        if (password !== confirmPassword) {
            return { status: 400, message: "Passwords do not match" };
        }

        const user = await this.userRepository.findUserById(userId);

        if (!user) {
            return { status: 404, message: "User not found" };
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        await this.userRepository.updateUserPassword(userId, hashPassword);

        return {
            status: 200,
            message: "Password reset successfully"
        };
    };
};

module.exports = AuthService;
