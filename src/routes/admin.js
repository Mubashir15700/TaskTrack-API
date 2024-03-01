const express = require("express");
const hasToken = require("../middlewares/auth/hasToken");
const { uploadImage } = require("../middlewares/imageUpload/s3Upload");
const catchAsync = require("../utils/errorHandling/catchAsync");

const router = express.Router();

const UserController = require("../controllers/admin/user");
const UserService = require("../services/admin/user");
const UserRepository = require("../repositories/user");
const userRepository = new UserRepository();

const PlanController = require("../controllers/admin/plan");
const PlanService = require("../services/admin/plan");
const PlanRepository = require("../repositories/plan");
const planRepository = new PlanRepository();

const SubscriptionController = require("../controllers/admin/subscription");
const SubscriptionService = require("../services/admin/subscription");
const SubscriptionRepository = require("../repositories/subscription");
const subscriptionRepository = new SubscriptionRepository();

const BannerController = require("../controllers/admin/banner");
const BannerService = require("../services/admin/banner");
const BannerRepository = require("../repositories/banner");
const bannerRepository = new BannerRepository();

const NotificationController = require("../controllers/notification");
const NotificationService = require("../services/notification");
const NotificationRepository = require("../repositories/notification");
const notificationRepository = new NotificationRepository();

const LaborerRepository = require("../repositories/laborer");
const laborerRepository = new LaborerRepository();

const RequestRepository = require("../repositories/request");
const requestRepository = new RequestRepository();

const ReasonRepository = require("../repositories/reason");
const reasonRepository = new ReasonRepository();

const userService = new UserService(userRepository, laborerRepository, requestRepository, reasonRepository);
const userController = new UserController(userService);

const planService = new PlanService(planRepository);
const planController = new PlanController(planService);

const subscriptionService = new SubscriptionService(subscriptionRepository);
const subscriptionController = new SubscriptionController(subscriptionService);

const bannerService = new BannerService(bannerRepository);
const bannerController = new BannerController(bannerService);

const notificationService = new NotificationService(notificationRepository);
const notificationController = new NotificationController(notificationService);

// user-related actions
router.get("/users", hasToken.adminHasToken, catchAsync(userController.getUsers.bind(userController)));
router.get("/users/:id", hasToken.adminHasToken, catchAsync(userController.getUser.bind(userController)));
router.post("/users/:id/block-unblock", hasToken.adminHasToken, catchAsync(userController.blockUnblockUser.bind(userController)));

// laborer request 
router.get("/requests", hasToken.adminHasToken, catchAsync(userController.getRequests.bind(userController)));
router.get("/requests/:id", hasToken.adminHasToken, catchAsync(userController.getRequest.bind(userController)));
router.post("/requests/list-unlist", hasToken.adminHasToken, catchAsync(userController.approveRejectAction.bind(userController)));

// plan-related actions
router.get("/plans", hasToken.adminHasToken, catchAsync(planController.getPlans.bind(planController)));
router.get("/plans/:id", hasToken.adminHasToken, catchAsync(planController.getPlan.bind(planController)));
router.post("/plans/add-plan", hasToken.adminHasToken, catchAsync(planController.addPlan.bind(planController)));
router.put("/plans/:id/edit-plan", hasToken.adminHasToken, catchAsync(planController.editPlan.bind(planController)));
router.patch("/plans/:id/list-unlist", hasToken.adminHasToken, catchAsync(planController.listUnlistPlan.bind(planController)));

// subscription
router.get("/subscriptions", hasToken.adminHasToken, catchAsync(subscriptionController.getSubscriptions.bind(subscriptionController)));

// banner-related actions
router.get("/banners", hasToken.adminHasToken, catchAsync(bannerController.getBanners.bind(bannerController)));
router.get("/banners/:id", hasToken.adminHasToken, catchAsync(bannerController.getBanner.bind(bannerController)));
router.post(
    "/banners/add-banner",
    hasToken.adminHasToken,
    uploadImage.single("image"),
    catchAsync(bannerController.addBanner.bind(bannerController))
);
router.put(
    "/banners/:id/edit-banner",
    hasToken.adminHasToken,
    uploadImage.single("image"),
    catchAsync(bannerController.editBanner.bind(bannerController))
);
router.patch("/banners/:id/list-unlist", hasToken.adminHasToken, catchAsync(bannerController.listUnlistBanner.bind(bannerController)));
router.patch("/banners/update-order", hasToken.adminHasToken, catchAsync(bannerController.updateBannerOrder.bind(bannerController)));

// notifications
router.get("/notifications/count", hasToken.adminHasToken, catchAsync(notificationController.getAdminNotificationsCount.bind(notificationController)));
router.get("/notifications/:page", hasToken.adminHasToken, catchAsync(notificationController.getAdminNotifications.bind(notificationController)));
router.patch(
    "/notifications/:id/mark-read",
    hasToken.adminHasToken,
    catchAsync(notificationController.markAdminNotificationRead.bind(notificationController))
);

module.exports = router;
