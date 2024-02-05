const express = require("express");
const notificationController = require("../controllers/notification");
const userUtilityController = require("../controllers/user/userUtility");
const profileController = require("../controllers/user/profile");
const laborerController = require("../controllers/user/laborer");
const jobController = require("../controllers/user/job");
const planController = require("../controllers/user/plan");
const subscriptionController = require("../controllers/user/subscription");
const checkUserStatus = require("../middlewares/auth/checkUserStatus");
const hasToken = require("../middlewares/auth/hasToken");
const imageUpload = require("../middlewares/imageUpload");

const router = express.Router();

// home page
router.get("/banners", checkUserStatus, userUtilityController.getBanners);

// profile actions
router.put(
    "/update-profile",
    checkUserStatus,
    hasToken.userHasToken,
    imageUpload("profile").single("profile"),
    profileController.updateProfile
);
router.delete(
    "/delete-profile-image",
    checkUserStatus,
    hasToken.userHasToken,
    profileController.deleteProfileImage
);
router.get(
    "/current-location",
    checkUserStatus,
    hasToken.userHasToken,
    profileController.getCurrentLocation
);
router.delete(
    "/delete-current-location/:id",
    checkUserStatus,
    hasToken.userHasToken,
    profileController.deleteCurrentLocation
);
router.put(
    "/update-laborer-profile",
    checkUserStatus,
    hasToken.userHasToken,
    profileController.updateLaborerProfile
);

// laborer actions
router.get("/laborers", checkUserStatus, laborerController.getLaborers);
router.get("/laborer/:id", checkUserStatus, laborerController.getLaborer);

// laborer request
router.post("/send-request", checkUserStatus, hasToken.userHasToken, laborerController.sendRequest);
router.get("/prev-request/:id", checkUserStatus, hasToken.userHasToken, laborerController.getPrevRequest);
router.put("/update-request", checkUserStatus, hasToken.userHasToken, laborerController.updateRequest);
router.patch("/cancel-request", checkUserStatus, hasToken.userHasToken, laborerController.cancelRequest);

// job actions
router.get("/jobs", checkUserStatus, jobController.getJobs);
router.get("/job/:id", checkUserStatus, jobController.getJob);
router.post("/apply-job", checkUserStatus, hasToken.userHasToken, jobController.applyJob);
router.post("/cancel-job-application", checkUserStatus, hasToken.userHasToken, jobController.cancelJobApplication);
router.get("/remainig-posts", checkUserStatus, hasToken.userHasToken, jobController.getRemainingPosts);
router.post("/post-job", checkUserStatus, hasToken.userHasToken, jobController.postJob);
router.get("/listed-jobs/:id/:page", checkUserStatus, hasToken.userHasToken, jobController.getListedJobs);
router.get("/listed-job/:id", checkUserStatus, hasToken.userHasToken, jobController.getListedJob);
router.put("/edit-listed-job", checkUserStatus, hasToken.userHasToken, jobController.editListedJob);
router.delete("/delete-listed-job/:id", checkUserStatus, hasToken.userHasToken, jobController.deleteListedJob);
router.get("/applicants/:jobId/:field", checkUserStatus, hasToken.userHasToken, jobController.getApplicants);
router.patch("/applicant-action", checkUserStatus, hasToken.userHasToken, jobController.takeApplicantAction);
router.get("/works-history/:id", checkUserStatus, hasToken.userHasToken, jobController.getWorksHistory);

// notifications
router.get(
    "/notifications-count/:id",
    checkUserStatus,
    hasToken.userHasToken,
    notificationController.getUserNotificationsCount
);
router.get(
    "/notifications/:id",
    checkUserStatus,
    hasToken.userHasToken,
    notificationController.getUserNotifications
);
router.patch(
    "/notification/mark-read/:id",
    checkUserStatus,
    hasToken.userHasToken,
    notificationController.markUserNotificationRead
);

// plans
router.get("/plans", checkUserStatus, hasToken.userHasToken, planController.getPlans);

// subscriptions
router.post("/create-subscription", subscriptionController.createSubscription);
router.post("/save-subscription-result", subscriptionController.saveSubscriptionResult);
router.get("/active-plan", subscriptionController.getActivePlan);
router.post("/cancel-active-plan", subscriptionController.cancelActivePlan);

module.exports = router;
