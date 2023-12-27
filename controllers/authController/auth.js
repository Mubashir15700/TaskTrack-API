const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const catchAsync = require('../../utils/catchAsync');
const sendMail = require('../../utils/sendMail');
const Admin = require('../../models/adminModel');
const User = require('../../models/userModel');

exports.checkAuth = catchAsync(async (req, res) => {
    const token = req.body.role === 'admin' ? req.cookies.adminJwt : req.cookies.userJwt;
    if (!token) {
        return res.status(401).json({ status: "failed", message: "Unauthorized user" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    let currentUser;
    if (decoded.role === 'admin') {
        currentUser = await Admin.findById(decoded.adminId).select('-password');
    } else {
        currentUser = await User.findById(decoded.userId).select('-password');
    }

    res.status(201).json({
        status: "success",
        message: `Authorized ${decoded.role}`,
        currentUser,
        role: decoded.role
    });
});

exports.adminLogin = catchAsync(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ status: "failed", message: "All fields are required" });
    }

    let admin = await Admin.findOne({ username });

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
            username: admin.username,
        };

        return res.json({
            status: "success",
            message: "Logged in successfully",
            token,
            currentUser: adminDataToSend,
        });
    } else {
        return res.status(401).json({ status: "failed", message: "Invalid username or password" });
    }
});

exports.userSignUp = catchAsync(async (req, res) => {
    const { username, email, phone, password, confirmPassword } = req.body;

    // Check if the username is already taken
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
        return res.status(400).send({ "status": "failed", "message": "This username is already taken" });
    }

    // Check if the email is already registered
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
        return res.status(400).send({ "status": "failed", "message": "This email is already registered" });
    }

    // Validate required fields
    const requiredFields = ['username', 'email', 'phone', 'password', 'confirmPassword',];
    if (!requiredFields.every(field => req.body[field])) {
        return res.status(400).send({ "status": "failed", "message": "All fields are required" });
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
        return res.status(400).send({ "status": "failed", "message": "Password and confirm password don't match" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Create and save new staff member
    const newUser = new User({
        username,
        email,
        phone,
        password: hashPassword,
    });

    // Generate OTP
    const generatedOTP = crypto.randomInt(100000, 999999); // Example OTP generation

    // Save the OTP to the user document (you should add an otp field to your User schema)
    newUser.otp = generatedOTP;

    const user = await newUser.save();

    // Generate JWT Token
    const token = jwt.sign({ userId: user._id, role: 'user' }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });

    res.cookie('userJwt', token, {
        maxAge: 60000 * 60 * 24 * 7,
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        // sameSite: 'None', // Uncomment and set appropriate value if needed
    });

    const options = {
        from: process.env.USER,
        to: email,
        subject: 'TaskTrack verification OTP',
        html: `<center> <h2>Verify Your Email </h2> <br> <h5>OTP :${generatedOTP} </h5><br><p>This otp is only valid for 5 minutes</p></center>`
    }
    await sendMail(options);

    res.status(201).send({
        status: "success",
        message: "Registered user successfully",
        token,
        currentUser: user,
    });
});

exports.userLogin = catchAsync(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ status: "failed", message: "All fields are required" });
    }

    let user = await User.findOne({ username });

    if (!user) {
        return res.status(401).json({ status: "failed", message: `Invalid credentials` });
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

        return res.json({
            status: "success",
            message: "Logged in successfully",
            token,
            currentUser: userDataToSend,
        });
    } else {
        return res.status(401).json({ status: "failed", message: "Invalid username or password" });
    }
});

exports.verifyOtp = catchAsync(async (req, res) => {
    const otp = Number(req.body.otp);
    const user = await User.findOne({ otp });
    // console.log(otp, user);
    if (!user) {
        return res.status(401).json({ status: "failed", message: "Invalid" });
    } else {
        const verifiedUser = await User.findOneAndUpdate(
            { email: req.body.email },
            { $set: { isVerified: true } },
            { new: true }
        );
        if (verifiedUser && verifiedUser.isVerified) {
            return res.status(200).json({ status: 'success', message: 'You are verified' });
        } else {
            return res.status(401).json({ status: "failed", message: "Invalid" });
        }
    };
});

exports.resendOtp = catchAsync(async (req, res) => {
    const email = req.body.email;

    // Generate OTP
    const generatedOTP = crypto.randomInt(100000, 999999); // Example OTP generation

    // Update the user's OTP in the database
    const user = await User.findOneAndUpdate(
        { email },
        { $set: { otp: generatedOTP } },
        { new: true } // to return the updated document
    );

    if (!user) {
        return res.status(404).json({ status: "failed", message: "User not found" });
    }

    const options = {
        from: process.env.USER,
        to: email,
        subject: 'TaskTrack verification OTP',
        html: `<center> <h2>Verify Your Email </h2> <br> <h5>OTP :${generatedOTP} </h5><br><p>This OTP is only valid for 5 minutes</p></center>`
    };

    await sendMail(options);
    return res.status(200).json({ status: 'success', message: 'OTP resent successfully' });
});

exports.confirmEmail = catchAsync(async (req, res) => {
    const email = req.body.email;

    // Generate OTP
    const generatedOTP = crypto.randomInt(100000, 999999); // Example OTP generation

    // Update the user's OTP in the database
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ status: "failed", message: "User not found" });
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
    return res.status(200).json({ status: 'success', message: 'OTP sent successfully' });
});

exports.resetPassword = catchAsync(async (req, res) => {
    const { userId, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ status: "failed", message: "Passwords do not match" });
    }

    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({ status: "failed", message: "User not found" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    user.password = hashPassword;
    await user.save();

    return res.status(200).json({ status: 'success', message: 'Password reset successfully' });
});

// Logout
exports.logout = catchAsync(async (req, res) => {
    // Clear the JWT cookie
    if (req.body.role === 'admin') {
        res.clearCookie("adminJwt");
    } else {
        res.clearCookie("userJwt");
    }
    res.status(200).json({ status: "success", message: "Logged out successfully" });
});