const express = require("express");
const authController = require("../controllers/authController");
const userUtilityController = require("../controllers/userController/userUtilityController");
const profileController = require("../controllers/userController/profileController");
const laborerController = require("../controllers/userController/laborerController");
const jobController = require("../controllers/userController/jobController");
const imageUpload = require("../middlewares/imageUpload");
const checkUserStatus = require("../middlewares/auth/checkUserStatus");
const hasToken = require("../middlewares/auth/hasToken");

const router = express.Router();

// home page
router.get("/get-active-banners", checkUserStatus, userUtilityController.getBanners);

// authentication and account-related actions
router.get("/auth/checkauth", checkUserStatus, authController.checkAuth);
router.post("/sign-up", authController.userSignUp);
router.post("/login", authController.userLogin);
router.post("/logout", authController.logout);
router.post("/verify-otp", checkUserStatus, authController.verifyOtp);
router.post("/resend-otp", checkUserStatus, authController.resendOtp);
router.post("/confirm-email", checkUserStatus, authController.confirmEmail);
router.post("/reset-password", checkUserStatus, authController.resetPassword);

// profile actions
router.put("/update-profile", checkUserStatus, hasToken, imageUpload("profile").single("profile"), profileController.updateProfile);
router.delete("/delete-profile-image", checkUserStatus, hasToken, profileController.deleteProfileImage);
router.get("/get-current-location", checkUserStatus, hasToken, profileController.getCurrentLocation);
router.delete("/delete-current-location", checkUserStatus, hasToken, profileController.deleteCurrentLocation);

// laborer actions
router.get("/get-laborers", checkUserStatus, hasToken, laborerController.getLaborers);
router.get("/get-laborer/:id", checkUserStatus, hasToken, laborerController.getLaborer);

// job actions
router.get("/get-jobs", checkUserStatus, hasToken, jobController.getJobs);
router.get("/get-listed-jobs/:id", checkUserStatus, hasToken, jobController.getListedJobs);
router.post("/post-job", checkUserStatus, hasToken, jobController.postJob);
router.get("/get-job/:id", checkUserStatus, hasToken, jobController.getJob);
router.put("/edit-job/:id", checkUserStatus, hasToken, jobController.editJob);

module.exports = router;
