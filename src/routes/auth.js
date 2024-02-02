const express = require("express");
const authController = require("../controllers/auth");
const checkUserStatus = require("../middlewares/auth/checkUserStatus");

const router = express.Router();

// admin
router.get("/auth/checkauth", authController.checkAuth);
router.post("/admin/login", authController.adminLogin);

// user
router.get("/checkauth", checkUserStatus, authController.checkAuth);
router.post("/sign-up", authController.userSignUp);
router.post("/login", authController.userLogin);
router.post("/verify-otp", checkUserStatus, authController.verifyOtp);
router.post("/resend-otp", checkUserStatus, authController.resendOtp);
router.post("/confirm-email", checkUserStatus, authController.confirmEmail);
router.post("/reset-password", checkUserStatus, authController.resetPassword);

// logout
router.post("/logout", authController.logout);

module.exports = router;
