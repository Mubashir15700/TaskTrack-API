const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const imageUpload = require("../middlewares/imageUpload");
const checkUserStatus = require("../middlewares/auth/checkUserStatus");
const hasToken = require("../middlewares/auth/hasToken");

const router = express.Router();

// authentication and account-related actions
router.post("/auth/checkauth", checkUserStatus, authController.checkAuth);
router.post("/sign-up", authController.userSignUp);
router.post("/login", authController.userLogin);
router.post("/logout", authController.logout);
router.post("/verify-otp", checkUserStatus, authController.verifyOtp);
router.post("/resend-otp", checkUserStatus, authController.resendOtp);
router.post("/confirm-email", checkUserStatus, authController.confirmEmail);
router.post("/reset-password", checkUserStatus, authController.resetPassword);

// profile actions
router.post("/update-profile", checkUserStatus, hasToken, imageUpload.single('profile'), userController.updateProfile);
router.post("/delete-profile-image", checkUserStatus, hasToken, userController.deleteProfileImage);

module.exports = router;
