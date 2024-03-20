const passport = require("../config/passport");
const generateToken = require("../utils/generateJwt");
const setCookie = require("../utils/setCookie");
const sendResponse = require("../utils/responseStructure");

class AuthController {
    constructor(authService) {
        this.authService = authService;
    };

    async checkAuth(req, res) {
        const { role } = req.query;
        const token = role === "admin" ?
            req.cookies.adminJwt :
            req.cookies.userJwt;
        const result = await this.authService.checkAuth(token, role);
        sendResponse(res, result);
    };

    async handleGoogleLoginCallback(req, res) {
        passport.authenticate("google", async (err, user, info) => {
            if (err) {
                // Handle authentication error
                return res.redirect(`${process.env.CORS_ORIGIN}/login?error=${encodeURIComponent(err.message)}`);
            }

            if (!user) {
                // Handle authentication failure
                return res.redirect(`${process.env.CORS_ORIGIN}/login?error=Authentication failed`);
            }

            // Generate JWT token
            const token = await generateToken(user._id, "user");

            // Set JWT token in response cookie
            setCookie(res, "userJwt", token);

            // Redirect user to success page
            return res.redirect(`${process.env.CORS_ORIGIN}`);
        })(req, res);
    };

    async login(req, res) {
        const { username, password, role } = req.body;
        const result = await this.authService.login(username, password, role);
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
    };

    async userSignUp(req, res) {
        const { username, email, phone, password, confirmPassword } = req.body;
        const result = await this.authService.signUp({
            username, email, phone, password, confirmPassword
        });
        sendResponse(res, result);
    };

    async verifyOtp(req, res) {
        const otp = Number(req.body.otp);
        const email = req.body.email;
        const result = await this.authService.verifyOtp(otp, email);
        if (result.status === 200) {
            setCookie(res, "userJwt", result.data.token);
        }
        const { status, message } = result;
        const dataToSend = {
            status,
            message,
        };
        sendResponse(res, dataToSend);
    };

    async resendOtp(req, res) {
        const email = req.body.email;
        const result = await this.authService.resendOtp(email);
        sendResponse(res, result);
    };

    async confirmEmail(req, res) {
        const email = req.body.email;
        const result = await this.authService.confirmEmail(email);
        sendResponse(res, result);
    };

    async resetPassword(req, res) {
        const { userId, password, confirmPassword } = req.body;
        const result = await this.authService.resetPassword(
            userId, password, confirmPassword
        );
        sendResponse(res, result);
    };

    async logout(req, res) {
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
    };
};

module.exports = AuthController;
