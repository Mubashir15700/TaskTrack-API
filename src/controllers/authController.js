const authService = require("../services/authService");
const catchAsync = require("../utils/catchAsync");
const { setCookie } = require("../utils/setCookie");
const sendResponse = require("../utils/responseStructure");

exports.checkAuth = catchAsync(async (req, res) => {
    const { role } = req.body;
    const token = role === "admin" ?
        req.cookies.adminJwt :
        req.cookies.userJwt;
    const result = await authService.checkAuth(token, role);
    sendResponse(res, result);
});

exports.adminLogin = catchAsync(async (req, res) => {
    const { username, password } = req.body;
    const result = await authService.adminLogin(username, password);
    if (result.status === 201) {
        setCookie(res, "adminJwt", result.data.token);
    }
    sendResponse(res, result);
});

exports.userSignUp = catchAsync(async (req, res) => {
    const { username, email, phone, password, confirmPassword } = req.body;
    // Validate required fields
    const requiredFields = [
        "username", "email", "phone", "password", "confirmPassword"
    ];
    if (!requiredFields.every(field => req.body[field])) {
        return res.status(400).json({
            status: "success",
            message: "All fields are required"
        });
    }
    const result = await authService.signUp(
        username, email, phone, password, confirmPassword
    );
    sendResponse(res, result);
});

exports.userLogin = catchAsync(async (req, res) => {
    const { username, password } = req.body;
    const result = await authService.userLogin(username, password);
    if (result.status === 201) {
        setCookie(res, "userJwt", result.data.token);
    }
    sendResponse(res, result);
});

exports.verifyOtp = catchAsync(async (req, res) => {
    const otp = Number(req.body.otp);
    const email = req.body.email;
    const result = await authService.verifyOtp(otp, email);
    if (result.status === 201) {
        setCookie(res, "userJwt", result.data.token);
    }
    sendResponse(res, result);
});

exports.resendOtp = catchAsync(async (req, res) => {
    const email = req.body.email;
    const result = await authService.resendOtp(email);
    sendResponse(res, result);
});

exports.confirmEmail = catchAsync(async (req, res) => {
    const email = req.body.email;
    const result = await authService.confirmEmail(email);
    sendResponse(res, result);
});

exports.resetPassword = catchAsync(async (req, res) => {
    const { userId, password, confirmPassword } = req.body;
    const result = await authService.resetPassword(
        userId, password, confirmPassword
    );
    sendResponse(res, result);
});

exports.logout = catchAsync(async (req, res) => {
    const { role } = req.body;
    if (role === "admin") {
        setCookie(res, "adminJwt", "", { maxAge: 0 });
    } else {
        setCookie(res, "userJwt", "", { maxAge: 0 });
    }
    res.status(200).json({
        status: "success",
        message: "Logged out successfully"
    });
});