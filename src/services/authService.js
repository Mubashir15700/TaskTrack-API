const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const authRepository = require('../repositories/authRepository');
const sendMail = require('../utils/sendMail');

exports.checkAuth = async (token) => {
    try {
        if (!token) {
            return { status: 401, message: 'Unauthorized user' };
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        let currentUser;
        if (decoded.role === 'admin') {
            currentUser = await authRepository.findAdminById(decoded.adminId);
        } else {
            currentUser = await authRepository.findCurrentUserById(decoded.userId);
        }

        return {
            status: 201,
            message: `Authorized ${decoded.role}`,
            currentUser,
            role: decoded.role
        };
    } catch (error) {
        console.log(error);
        return { status: 500, message: 'Internal Server Error' };
    }
};

exports.adminLogin = async (res, username, password) => {
    try {
        if (!username || !password) {
            return res.status(400).json({ status: "failed", message: "All fields are required" });
        }

        const admin = await authRepository.findAdminByUserName(username);

        if (!admin) {
            return res.status(401).json({ status: "failed", message: `Invalid credentials` });
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (isMatch) {
            // Generate JWT Token
            const token = jwt.sign({ adminId: admin._id, role: 'admin' }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
            // Save token to cookie
            res.cookie('adminJwt', token, {
                maxAge: 60000 * 60 * 24 * 7,
                httpOnly: true,
                // secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                // sameSite: 'None', // Uncomment and set appropriate value if needed
            });

            // Create a admin object without the password field
            const adminDataToSend = {
                _id: admin._id,
                username: admin.username,  // undefined. to fix
            };

            return {
                status: 201,
                message: 'Logged in successfully',
                token,
                currentUser: adminDataToSend,
            };
        } else {
            return { status: 400, message: 'Invalid username or password' };
        }
    } catch (error) {
        console.log(error);
        return { status: 500, message: 'Internal Server Error' };
    }
};

exports.signUp = async (req, username, email, phone, password, confirmPassword) => {
    try {
        // Check if the username is already taken
        const existingUsername = await authRepository.checkExistingUsername(username);
        if (existingUsername) {
            return { status: 400, message: 'This username is already taken' };
        }

        // Check if the email is already registered
        const existingEmail = await authRepository.checkExistingEmail(email);
        if (existingEmail) {
            return { status: 400, message: 'This email is already registered' };
        }

        // Validate required fields
        const requiredFields = ['username', 'email', 'phone', 'password', 'confirmPassword'];
        if (!requiredFields.every(field => req.body[field])) {
            return { status: 400, message: 'All fields are required' };
        }

        // Check if password and confirm password match
        if (password !== confirmPassword) {
            return { status: 400, message: 'Password and confirm password don\'t match' };
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // Generate OTP
        const generatedOTP = crypto.randomInt(100000, 999999);

        // Create user in the repository
        const user = await authRepository.createUser(username, email, phone, hashPassword, generatedOTP);

        // Generate JWT Token
        const token = jwt.sign({ userId: user._id, role: 'user' }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });

        // Send verification email
        const emailOptions = {
            from: process.env.USER,
            to: email,
            subject: 'TaskTrack Verification OTP',
            html: `<center> <h2>Verify Your Email </h2> <br> <h5>OTP: ${generatedOTP} </h5><br><p>This OTP is only valid for 5 minutes</p></center>`
        };
        await sendMail(emailOptions);

        return {
            status: 201,
            message: 'Registered user successfully',
            data: { token, currentUser: user }
        };
    } catch (error) {
        console.error(error);
        return { status: 500, message: 'Internal Server Error' };
    }
};

exports.userLogin = async (res, username, password) => {
    try {
        if (!username || !password) {
            return { status: 400, message: 'All fields are required' };
        }

        const user = await authRepository.findUserByUsername(username);

        if (!user) {
            return { status: 400, message: 'Invalid credentials' };
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            // Generate JWT Token
            const token = jwt.sign({ userId: user._id, role: 'user' }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
            // Save token to cookie
            res.cookie('userJwt', token, {
                maxAge: 60000 * 60 * 24 * 7,
                httpOnly: true,
                // secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                // sameSite: 'None', // Uncomment and set appropriate value if needed
            });

            // Create a user object without the password field
            const userDataToSend = {
                _id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                isJobSeeker: user.isJobSeeker,
                isBlocked: user.isBlocked,
                isVerified: user.isVerified,
            };

            return {
                status: 201,
                message: 'Logged in successfully',
                token,
                currentUser: userDataToSend,
            };
        } else {
            return { status: 400, message: 'Invalid username or password' };
        }
    } catch (error) {
        console.log(error);
        return { status: 500, message: 'Internal Server Error' };
    }
};

exports.verifyOtp = async (otp, email) => {
    try {
        const user = await authRepository.findUserByOtp(otp);

        if (!user) {
            return { status: 400, message: 'Invalid' };
        } else {
            const verifiedUser = await authRepository.findUserAndVerify(email);
            if (verifiedUser && verifiedUser.isVerified) {
                return {
                    status: 201,
                    message: 'You are verified'
                };
            } else {
                return { status: 400, message: 'Invalid' };
            }
        };
    } catch (error) {
        console.log(error);
        return { status: 500, message: 'Internal Server Error' };
    }
};

exports.resendOtp = async (email) => {
    try {
        // Generate OTP
        const generatedOTP = crypto.randomInt(100000, 999999); // Example OTP generation

        // Update the user's OTP in the database
        const user = await authRepository.findUserAndUpdateOtp(email, generatedOTP);

        if (!user) {
            return { status: 400, message: 'User not found' };
        }

        const options = {
            from: process.env.USER,
            to: email,
            subject: 'TaskTrack verification OTP',
            html: `<center> <h2>Verify Your Email </h2> <br> <h5>OTP :${generatedOTP} </h5><br><p>This OTP is only valid for 5 minutes</p></center>`
        };

        await sendMail(options);

        return {
            status: 201,
            message: 'OTP resent successfully'
        };
    } catch (error) {
        console.log(error);
        return { status: 500, message: 'Internal Server Error' };
    }
};

exports.confirmEmail = async (email) => {
    try {
        // Generate OTP
        const generatedOTP = crypto.randomInt(100000, 999999); // Example OTP generation

        // Update the user's OTP in the database
        const user = await authRepository.checkExistingEmail(email);

        if (!user) {
            return { status: 400, message: 'User not found' };
        }

        user.otp = generatedOTP;
        await user.save();

        const options = {
            from: process.env.USER,
            to: email,
            subject: 'TaskTrack verification OTP',
            html: `<center> <h2>Verify Your Email </h2> <br> <h5>OTP :${generatedOTP} </h5><br><p>This OTP is only valid for 5 minutes</p></center>`
        };

        await sendMail(options);

        return {
            status: 201,
            message: 'OTP sent successfully'
        };
    } catch (error) {
        console.log(error);
        return { status: 500, message: 'Internal Server Error' };
    }
};

exports.resetPassword = async (userId, password, confirmPassword) => {
    try {
        if (password !== confirmPassword) {
            return res.status(400).json({ status: "failed", message: "Passwords do not match" });
        }

        const user = await authRepository.findUserById(userId);

        if (!user) {
            return { status: 400, message: 'User not found' };
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        await authRepository.updateUserPassword(userId, hashPassword);

        return {
            status: 201,
            message: 'Password reset successfully'
        };
    } catch (error) {
        console.log(error);
        return { status: 500, message: 'Internal Server Error' };
    }
};
