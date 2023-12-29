const authService = require('../services/authService');
const catchAsync = require('../utils/catchAsync');
const sendResponse = require('../utils/responseStructure');

exports.checkAuth = catchAsync(async (req, res) => {
    const { role } = req.body;
    const token = role === 'admin' ? req.cookies.adminJwt : req.cookies.userJwt;
    const result = await authService.checkAuth(token, role);
    const { status, message, data } = result;
    sendResponse(res, { status, message, data: data || {} });
});

exports.adminLogin = catchAsync(async (req, res) => {
    const { username, password } = req.body;
    const result = await authService.adminLogin(username, password);
    if (result.status === 201) {
        res.cookie('adminJwt', result.data.token, {
            maxAge: 60000 * 60 * 24 * 7,
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            // sameSite: 'None', // Uncomment and set appropriate value if needed
        });
    }
    const { status, message, data } = result;
    sendResponse(res, { status, message, data: data || {} });
});

exports.userSignUp = catchAsync(async (req, res) => {
    const { username, email, phone, password, confirmPassword } = req.body;
    // Validate required fields
    const requiredFields = ['username', 'email', 'phone', 'password', 'confirmPassword'];
    if (!requiredFields.every(field => req.body[field])) {
        return res.status(400).json({ status: 'success', message: 'All fields are required' });
    }
    const result = await authService.signUp(username, email, phone, password, confirmPassword);
    const { status, message, data } = result;
    sendResponse(res, { status, message, data: data || {} });
});

exports.userLogin = catchAsync(async (req, res) => {
    const { username, password } = req.body;
    const result = await authService.userLogin(username, password);
    if (result.status === 201) {
        res.cookie('userJwt', result.data.token, {
            maxAge: 60000 * 60 * 24 * 7,
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            // sameSite: 'None', // Uncomment and set appropriate value if needed
        });
    }
    const { status, message, data } = result;
    sendResponse(res, { status, message, data: data || {} });
});

exports.verifyOtp = catchAsync(async (req, res) => {
    const otp = Number(req.body.otp);
    const email = req.body.email;
    const result = await authService.verifyOtp(otp, email);
    if (result.status === 201) {
        res.cookie('userJwt', result.data.token, {
            maxAge: 60000 * 60 * 24 * 7,
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            // sameSite: 'None', // Uncomment and set appropriate value if needed
        });
    }
    const { status, message, data } = result;
    sendResponse(res, { status, message, data: data || {} });
});

exports.resendOtp = catchAsync(async (req, res) => {
    const email = req.body.email;
    const result = await authService.resendOtp(email);
    const { status, message, data } = result;
    sendResponse(res, { status, message, data: data || {} });
});

exports.confirmEmail = catchAsync(async (req, res) => {
    const email = req.body.email;
    const result = await authService.confirmEmail(email);
    const { status, message, data } = result;
    sendResponse(res, { status, message, data: data || {} });
});

exports.resetPassword = catchAsync(async (req, res) => {
    const { userId, password, confirmPassword } = req.body;
    const result = await authService.resetPassword(userId, password, confirmPassword);
    const { status, message, data } = result;
    sendResponse(res, { status, message, data: data || {} });
});

exports.logout = catchAsync(async (req, res) => {
    const { role } = req.body;
    if (role === 'admin') {
        res.clearCookie("adminJwt");
    } else {
        res.clearCookie("userJwt");
    }
    res.status(200).json({ status: "success", message: "Logged out successfully" });
});