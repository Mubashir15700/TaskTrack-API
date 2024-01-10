const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController/userController");
const imageUpload = require("../middlewares/imageUpload");
const checkUserStatus = require("../middlewares/auth/checkUserStatus");
const hasToken = require("../middlewares/auth/hasToken");

const router = express.Router();

// home page
router.get("/get-active-banners", checkUserStatus, userController.getBanners);

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
router.post("/update-profile", checkUserStatus, hasToken, imageUpload("profile").single("profile"), userController.updateProfile);
router.post("/delete-profile-image", checkUserStatus, hasToken, userController.deleteProfileImage);
router.post("/get-current-location", checkUserStatus, hasToken, userController.getCurrentLocation);
router.post("/delete-current-location", checkUserStatus, hasToken, userController.deleteCurrentLocation);

// laborer actions
router.get("/get-laborers", checkUserStatus, hasToken, userController.getLaborers);
router.get("/get-laborer/:id", checkUserStatus, hasToken, userController.getLaborer);

// job actions
router.get("/get-jobs", checkUserStatus, hasToken, userController.getJobs);
router.post("/post-job", checkUserStatus, hasToken, userController.postJob);
router.get("/get-job/:id", checkUserStatus, hasToken, userController.getJob);
router.post("/edit-job/:id", checkUserStatus, hasToken, userController.editJob);

module.exports = router;
