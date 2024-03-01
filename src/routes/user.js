const express = require("express");
const checkUserStatus = require("../middlewares/auth/checkUserStatus");
const hasToken = require("../middlewares/auth/hasToken");
const diskUpload = require("../middlewares/imageUpload/diskUpload");
const catchAsync = require("../utils/errorHandling/catchAsync");

const router = express.Router();

const UserUtilityController = require("../controllers/user/userUtility");
const UserUtilityService = require("../services/user/userUtility");
const BannerRepository = require("../repositories/banner");
const ChatRepository = require("../repositories/chat");
const bannerRepository = new BannerRepository();
const chatRepository = new ChatRepository();
const userUtilityService = new UserUtilityService(bannerRepository, chatRepository);
const userUtilityController = new UserUtilityController(userUtilityService);

const ProfileController = require("../controllers/user/profile");
const ProfileService = require("../services/user/profile");
const UserRepository = require("../repositories/user");
const LaborerRepository = require("../repositories/laborer");
const userRepository = new UserRepository();
const laborerRepository = new LaborerRepository();
const profileService = new ProfileService(userRepository, laborerRepository);
const profileController = new ProfileController(profileService);

const LaborerController = require("../controllers/user/laborer");
const LaborerService = require("../services/user/laborer");
const RequestRepository = require("../repositories/request");
const ReasonRepository = require("../repositories/reason");
const requestRepository = new RequestRepository();
const reasonRepository = new ReasonRepository();
const laborerService = new LaborerService(userRepository, laborerRepository, requestRepository, reasonRepository);
const laborerController = new LaborerController(laborerService);

const JobController = require("../controllers/user/job");
const JobService = require("../services/user/job");
const JobRepository = require("../repositories/job");
const SubscriptionRepository = require("../repositories/subscription");
const jobRepository = new JobRepository();
const subscriptionRepository = new SubscriptionRepository();
const jobService = new JobService(jobRepository, reasonRepository, subscriptionRepository);
const jobController = new JobController(jobService);

const NotificationController = require("../controllers/notification");
const NotificationService = require("../services/notification");
const NotificationRepository = require("../repositories/notification");
const notificationRepository = new NotificationRepository();
const notificationService = new NotificationService(notificationRepository);
const notificationController = new NotificationController(notificationService);

const PlanController = require("../controllers/user/plan");
const PlanService = require("../services/user/plan");
const PlanRepository = require("../repositories/plan");
const planRepository = new PlanRepository();
const planService = new PlanService(planRepository);
const planController = new PlanController(planService);

const SubscriptionController = require("../controllers/user/subscription");
const SubscriptionService = require("../services/user/subscription");
const subscriptionService = new SubscriptionService(subscriptionRepository, userRepository);
const subscriptionController = new SubscriptionController(subscriptionService);

// home page
router.get("/banners", checkUserStatus, catchAsync(userUtilityController.getBanners.bind(userUtilityController)));

// profile actions
router.put(
    "/profile/update",
    checkUserStatus,
    hasToken.userHasToken,
    diskUpload("profile").single("profile"),
    catchAsync(profileController.updateProfile.bind(profileController))
);
router.delete(
    "/profile/delete-image",
    checkUserStatus,
    hasToken.userHasToken,
    catchAsync(profileController.deleteProfileImage.bind(profileController))
);
router.get(
    "/profile/current-location",
    checkUserStatus,
    hasToken.userHasToken,
    catchAsync(profileController.getCurrentLocation.bind(profileController))
);
router.delete(
    "/profile/:id/delete-current-location",
    checkUserStatus,
    hasToken.userHasToken,
    catchAsync(profileController.deleteCurrentLocation.bind(profileController))
);
router.put(
    "/profile/update-laborer",
    checkUserStatus,
    hasToken.userHasToken,
    catchAsync(profileController.updateLaborerProfile.bind(profileController))
);

// laborer actions
router.get("/laborers/:id/:page", checkUserStatus, catchAsync(laborerController.getLaborers.bind(laborerController)));
router.get("/laborers/:id", checkUserStatus, catchAsync(laborerController.getLaborer.bind(laborerController)));

// laborer request
router.post("/request/send", checkUserStatus, hasToken.userHasToken, catchAsync(laborerController.sendRequest.bind(laborerController)));
router.get("/request/:id", checkUserStatus, hasToken.userHasToken, catchAsync(laborerController.getPrevRequest.bind(laborerController)));
router.put("/request/update", checkUserStatus, hasToken.userHasToken, catchAsync(laborerController.updateRequest.bind(laborerController)));
router.patch("/request/cancel", checkUserStatus, hasToken.userHasToken, catchAsync(laborerController.cancelRequest.bind(laborerController)));

// job actions
router.post("/jobs/posts/new", checkUserStatus, hasToken.userHasToken, catchAsync(jobController.postJob.bind(jobController)));
router.get("/jobs/listed/:id/:page", checkUserStatus, hasToken.userHasToken, catchAsync(jobController.getListedJobs.bind(jobController)));
router.get("/jobs/listed/:id", checkUserStatus, hasToken.userHasToken, catchAsync(jobController.getListedJob.bind(jobController)));
router.put("/jobs/listed/edit", checkUserStatus, hasToken.userHasToken, catchAsync(jobController.editListedJob.bind(jobController)));
router.post("/jobs/apply", checkUserStatus, hasToken.userHasToken, catchAsync(jobController.applyJob.bind(jobController)));
router.post("/jobs/cancel-application", checkUserStatus, hasToken.userHasToken, catchAsync(jobController.cancelJobApplication.bind(jobController)));
router.get("/jobs/posts/remaining", checkUserStatus, hasToken.userHasToken, catchAsync(jobController.getRemainingPosts.bind(jobController)));
router.delete("/jobs/listed/:id/delete", checkUserStatus, hasToken.userHasToken, catchAsync(jobController.deleteListedJob.bind(jobController)));
router.get("/jobs/applicants/:id/:field", checkUserStatus, hasToken.userHasToken, catchAsync(jobController.getApplicants.bind(jobController)));
router.patch("/jobs/applicant-action", checkUserStatus, hasToken.userHasToken, catchAsync(jobController.takeApplicantAction.bind(jobController)));
router.get("/jobs/works-history/:id/:page", checkUserStatus, hasToken.userHasToken, catchAsync(jobController.getWorksHistory.bind(jobController)));
router.get("/jobs/:id/:page", checkUserStatus, catchAsync(jobController.getJobs.bind(jobController)));
router.get("/jobs/:id", checkUserStatus, catchAsync(jobController.getJob.bind(jobController)));

// notifications
router.get(
    "/notifications/count/:id",
    checkUserStatus,
    hasToken.userHasToken,
    catchAsync(notificationController.getUserNotificationsCount.bind(notificationController))
);
router.get(
    "/notifications/:id/:page",
    checkUserStatus,
    hasToken.userHasToken,
    catchAsync(notificationController.getUserNotifications.bind(notificationController))
);
router.patch(
    "/notifications/:id/mark-read",
    checkUserStatus,
    hasToken.userHasToken,
    catchAsync(notificationController.markUserNotificationRead.bind(notificationController))
);

// chat
router.patch(
    "/messages/mark-read/",
    checkUserStatus,
    hasToken.userHasToken,
    catchAsync(userUtilityController.updateMessagesReadStatus.bind(userUtilityController))
);

// plans
router.get("/plans", checkUserStatus, hasToken.userHasToken, catchAsync(planController.getPlans.bind(planController)));

// subscriptions
router.get("/subscription/stripe-public-key", catchAsync(subscriptionController.getStripePublicKey.bind(subscriptionController)));
router.post("/subscription/create", catchAsync(subscriptionController.createSubscription.bind(subscriptionController)));
router.post("/subscription/save", catchAsync(subscriptionController.saveSubscriptionResult.bind(subscriptionController)));
router.get("/plans/active-plan", catchAsync(subscriptionController.getActivePlan.bind(subscriptionController)));
router.post("/plans/cancel", catchAsync(subscriptionController.cancelActivePlan.bind(subscriptionController)));

module.exports = router;
