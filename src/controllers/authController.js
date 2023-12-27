const authService = require('../services/authService');
const catchAsync = require('../utils/catchAsync');
const authRepository = require('../repositories/authRepository');

exports.checkAuth = catchAsync(async (req, res) => {
    const token = req.body.role === 'admin' ? req.cookies.adminJwt : req.cookies.userJwt;

    const result = await authService.checkAuth(token);

    res.status(result.status).json({
        status: result.status === 201 ? 'success' : 'failed',
        message: result.message,
        currentUser: result.currentUser,
        role: result.role
    });
});

exports.adminLogin = catchAsync(async (req, res) => {
    const { username, password } = req.body;

    const result = await authService.adminLogin(res, username, password);

    res.status(result.status).json({
        status: result.status === 201 ? 'success' : 'failed',
        message: result.message,
        token: result.token,
        currentUser: result.currentUser,
    });
});

exports.userSignUp = catchAsync(async (req, res) => {
    const { username, email, phone, password, confirmPassword } = req.body;

    const result = await authService.signUp(req, username, email, phone, password, confirmPassword);

    res.status(result.status).json({
        status: result.status === 201 ? 'success' : 'failed',
        message: result.message,
        data: result.data
    });
});

exports.userLogin = catchAsync(async (req, res) => {
    const { username, password } = req.body;

    const result = await authService.userLogin(res, username, password);

    res.status(result.status).json({
        status: result.status === 201 ? 'success' : 'failed',
        message: result.message,
        token: result.token,
        currentUser: result.currentUser
    });
});

exports.verifyOtp = catchAsync(async (req, res) => {
    const otp = Number(req.body.otp);
    const email = req.body.email;

    const result = await authService.verifyOtp(otp, email);

    res.status(result.status).json({
        status: result.status === 201 ? 'success' : 'failed',
        message: result.message
    });
});

exports.resendOtp = catchAsync(async (req, res) => {
    const email = req.body.email;

    const result = await authService.resendOtp(email);

    res.status(result.status).json({
        status: result.status === 201 ? 'success' : 'failed',
        message: result.message
    });
});

exports.confirmEmail = catchAsync(async (req, res) => {
    const email = req.body.email;

    const result = await authService.confirmEmail(email);

    res.status(result.status).json({
        status: result.status === 201 ? 'success' : 'failed',
        message: result.message
    });
});

exports.resetPassword = catchAsync(async (req, res) => {
    const { userId, password, confirmPassword } = req.body;

    const result = await authService.resetPassword(userId, password, confirmPassword);

    res.status(result.status).json({
        status: result.status === 201 ? 'success' : 'failed',
        message: result.message
    });
});

exports.logout = catchAsync(async (req, res) => {
    const { role } = req.body;

    if (role === 'admin') {
        authRepository.clearAdminCookie(res);
    } else {
        authRepository.clearUserCookie(res);
    }

    res.status(200).json({ status: "success", message: "Logged out successfully" });
});