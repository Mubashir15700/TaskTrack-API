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
const diskUpload = require("../middlewares/imageUpload/diskUpload");

const router = express.Router();

// home page
router.get("/banners", checkUserStatus, userUtilityController.getBanners);

// profile actions
router.put(
    "/profile/update",
    checkUserStatus,
    hasToken.userHasToken,
    diskUpload("profile").single("profile"),
    profileController.updateProfile
);
router.delete(
    "/profile/delete-image",
    checkUserStatus,
    hasToken.userHasToken,
    profileController.deleteProfileImage
);
router.get(
    "/profile/current-location",
    checkUserStatus,
    hasToken.userHasToken,
    profileController.getCurrentLocation
);
router.delete(
    "/profile/:id/delete-current-location",
    checkUserStatus,
    hasToken.userHasToken,
    profileController.deleteCurrentLocation
);
router.put(
    "/profile/update-laborer",
    checkUserStatus,
    hasToken.userHasToken,
    profileController.updateLaborerProfile
);

// laborer actions
router.get("/laborers/:id/:page", checkUserStatus, laborerController.getLaborers);
router.get("/laborers/:id", checkUserStatus, laborerController.getLaborer);

// laborer request
router.post("/request/send", checkUserStatus, hasToken.userHasToken, laborerController.sendRequest);
router.get("/request/:id", checkUserStatus, hasToken.userHasToken, laborerController.getPrevRequest);
router.put("/request/update", checkUserStatus, hasToken.userHasToken, laborerController.updateRequest);
router.patch("/request/cancel", checkUserStatus, hasToken.userHasToken, laborerController.cancelRequest);

// job actions
router.get("/jobs/:id/:page", checkUserStatus, jobController.getJobs);
router.get("/jobs/:id", checkUserStatus, jobController.getJob);
router.post("/jobs/apply", checkUserStatus, hasToken.userHasToken, jobController.applyJob);
router.post("/jobs/cancel-application", checkUserStatus, hasToken.userHasToken, jobController.cancelJobApplication);
router.get("/jobs/remaining-posts", checkUserStatus, hasToken.userHasToken, jobController.getRemainingPosts);
router.post("/jobs/post", checkUserStatus, hasToken.userHasToken, jobController.postJob);
router.get("/jobs/listed/:id/:page", checkUserStatus, hasToken.userHasToken, jobController.getListedJobs);
router.get("/jobs/listed/:id", checkUserStatus, hasToken.userHasToken, jobController.getListedJob);
router.put("/jobs/edit", checkUserStatus, hasToken.userHasToken, jobController.editListedJob);
router.delete("/jobs/delete/:id", checkUserStatus, hasToken.userHasToken, jobController.deleteListedJob);
router.get("/jobs/applicants/:jobId/:field", checkUserStatus, hasToken.userHasToken, jobController.getApplicants);
router.patch("/jobs/applicant-action", checkUserStatus, hasToken.userHasToken, jobController.takeApplicantAction);
router.get("/jobs/works-history/:id/:page", checkUserStatus, hasToken.userHasToken, jobController.getWorksHistory);

// notifications
router.get(
    "/notifications/count/:id",
    checkUserStatus,
    hasToken.userHasToken,
    notificationController.getUserNotificationsCount
);
router.get(
    "/notifications/:id/:page",
    checkUserStatus,
    hasToken.userHasToken,
    notificationController.getUserNotifications
);
router.patch(
    "/notifications/:id/mark-read",
    checkUserStatus,
    hasToken.userHasToken,
    notificationController.markUserNotificationRead
);

// chat
router.patch(
    "/messages/mark-read/",
    checkUserStatus,
    hasToken.userHasToken,
    userUtilityController.updateMessagesReadStatus
);

// plans
router.get("/plans", checkUserStatus, hasToken.userHasToken, planController.getPlans);

// subscriptions
router.get("/subscription/stripe-public-key", subscriptionController.getStripePublicKey);
router.post("/subscription/create", subscriptionController.createSubscription);
router.post("/subscription/save", subscriptionController.saveSubscriptionResult);
router.get("/plans/active-plan", subscriptionController.getActivePlan);
router.post("/plans/cancel", subscriptionController.cancelActivePlan);

module.exports = router;
