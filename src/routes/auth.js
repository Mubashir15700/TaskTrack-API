const express = require("express");
const passport = require("../config/passport");
const catchAsync = require("../utils/errorHandling/catchAsync");

const router = express.Router();

const AuthController = require("../controllers/auth");
const AuthService = require("../services/auth");
const AdminRepository = require("../repositories/admin");
const UserRepository = require("../repositories/user");
const ReasonRepository = require("../repositories/reason");

const adminRepository = new AdminRepository();
const userRepository = new UserRepository();
const reasonRepository = new ReasonRepository();
const authService = new AuthService(adminRepository, userRepository, reasonRepository);
const authController = new AuthController(authService);

// admin
router.get("/admin/checkauth", catchAsync(authController.checkAuth.bind(authController)));

router.post("/login", catchAsync(authController.login.bind(authController)));

// user
// initial google oauth login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
// Handle Google authentication callback
router.get("/google/callback", authController.handleGoogleLoginCallback);

router.get("/checkauth", catchAsync(authController.checkAuth.bind(authController)));
router.get("/checkauth", catchAsync(authController.checkAuth.bind(authController)));
router.post("/sign-up", catchAsync(authController.userSignUp.bind(authController)));
router.post("/verify-otp", catchAsync(authController.verifyOtp.bind(authController)));
router.post("/resend-otp", catchAsync(authController.resendOtp.bind(authController)));
router.post("/confirm-email", catchAsync(authController.confirmEmail.bind(authController)));
router.post("/reset-password", catchAsync(authController.resetPassword.bind(authController)));

// logout
router.post("/logout", catchAsync(authController.logout.bind(authController)));

module.exports = router;
