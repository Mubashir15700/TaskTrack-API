const express = require("express");
const authController = require("../controllers/authController");
const userUtilityController = require("../controllers/userController/userUtilityController");
const profileController = require("../controllers/userController/profileController");
const laborerController = require("../controllers/userController/laborerController");
const jobController = require("../controllers/userController/jobController");
const checkUserStatus = require("../middlewares/auth/checkUserStatus");
const hasToken = require("../middlewares/auth/hasToken");
const imageUpload = require("../middlewares/imageUpload");

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
router.put("/update-profile", checkUserStatus, hasToken.userHasToken, imageUpload("profile").single("profile"), profileController.updateProfile);
router.delete("/delete-profile-image", checkUserStatus, hasToken.userHasToken, profileController.deleteProfileImage);
router.get("/get-current-location", checkUserStatus, hasToken.userHasToken, profileController.getCurrentLocation);
router.delete("/delete-current-location", checkUserStatus, hasToken.userHasToken, profileController.deleteCurrentLocation);

// laborer actions
router.get("/get-laborers", checkUserStatus, hasToken.userHasToken, laborerController.getLaborers);
router.get("/get-laborer/:id", checkUserStatus, hasToken.userHasToken, laborerController.getLaborer);
router.post("/send-request", checkUserStatus, hasToken.userHasToken, laborerController.sendRequest);
router.get("/get-prev-request/:id", checkUserStatus, hasToken.userHasToken, laborerController.getPrevRequest);
router.put("/update-request", checkUserStatus, hasToken.userHasToken, laborerController.updateRequest);
router.patch("/cancel-request", checkUserStatus, hasToken.userHasToken, laborerController.cancelRequest);

// job actions
router.get("/get-jobs", checkUserStatus, hasToken.userHasToken, jobController.getJobs);
router.get("/get-listed-jobs/:id", checkUserStatus, hasToken.userHasToken, jobController.getListedJobs);
router.post("/post-job", checkUserStatus, hasToken.userHasToken, jobController.postJob);
router.get("/get-job/:id", checkUserStatus, hasToken.userHasToken, jobController.getJob);
router.get("/get-listed-job/:id", checkUserStatus, hasToken.userHasToken, jobController.getListedJob);
router.put("/edit-listed-job", checkUserStatus, hasToken.userHasToken, jobController.editListedJob);
router.delete("/delete-listed-job/:id", checkUserStatus, hasToken.userHasToken, jobController.deleteListedJob);
router.get("/get-works-history/:id", checkUserStatus, hasToken.userHasToken, jobController.getWorksHistory);

module.exports = router;
