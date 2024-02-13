const authService = require("../services/auth");
const catchAsync = require("../utils/errorHandling/catchAsync");
const setCookie = require("../utils/setCookie");
const sendResponse = require("../utils/responseStructure");

exports.checkAuth = catchAsync(async (req, res) => {
    const { role } = req.query;
    const token = role === "admin" ?
        req.cookies.adminJwt :
        req.cookies.userJwt;
    const result = await authService.checkAuth(token, role);
    sendResponse(res, result);
});

exports.login = catchAsync(async (req, res) => {
    const { username, password, role } = req.body;
    const result = await authService.login(username, password, role);
    if (result.status === 200) {
        const cookieName = role === "admin" ? "adminJwt" : "userJwt";
        setCookie(res, cookieName, result.data.token);
    }
    const { status, message } = result;
    const dataToSend = {
        status,
        message,
        data: {
            currentUser: result.data?.currentUser
        }
    };
    sendResponse(res, dataToSend);
});

exports.loginWithGoogle = catchAsync(async (req, res) => {
    const { token } = req.body;
    const result = await authService.loginWithGoogle(token);
    if (result.status === 200) {
        setCookie(res, "userJwt", result.data.token);
    }
    const { status, message } = result;
    const dataToSend = {
        status,
        message,
        data: {
            currentUser: result.data?.currentUser
        }
    };
    sendResponse(res, dataToSend);
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

exports.verifyOtp = catchAsync(async (req, res) => {
    const otp = Number(req.body.otp);
    const email = req.body.email;
    const result = await authService.verifyOtp(otp, email);
    if (result.status === 200) {
        setCookie(res, "userJwt", result.data.token);
    }
    const { status, message } = result;
    const dataToSend = {
        status,
        message,
    };
    sendResponse(res, dataToSend);
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
        status: 200,
        message: "Logged out successfully"
    });
});
