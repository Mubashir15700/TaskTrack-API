const express = require("express");
const router = express.Router();
const authController = require('../controllers/authController/auth');

router.post("/auth/checkauth", authController.checkAuth);
router.post("/sign-up", authController.userSignUp);
router.post("/login", authController.userLogin);
router.post("/logout", authController.logout);
router.post("/verify-otp", authController.verifyOtp);
router.post("/resend-otp", authController.resendOtp);
router.post("/confirm-email", authController.confirmEmail);
router.post("/reset-password", authController.resetPassword);

module.exports = router;