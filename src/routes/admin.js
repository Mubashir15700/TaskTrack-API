const express = require("express");
const notificationController = require("../controllers/notification");
const userController = require("../controllers/admin/user");
const bannerController = require("../controllers/admin/banner");
const planController = require("../controllers/admin/plan");
const subscriptionController = require("../controllers/admin/subscription");
const hasToken = require("../middlewares/auth/hasToken");
const { uploadImage } = require("../middlewares/imageUpload/s3Upload");

const router = express.Router();

// user-related actions
router.get("/users", hasToken.adminHasToken, userController.getUsers);
router.get("/user/:id", hasToken.adminHasToken, userController.getUser);
router.post("/user-action", hasToken.adminHasToken, userController.blockUnblockUser);

// plan-related actions
router.get("/plans", hasToken.adminHasToken, planController.getPlans);
router.get("/plan/:id", hasToken.adminHasToken, planController.getPlan);
router.post("/add-plan", hasToken.adminHasToken, planController.addPlan);
router.put("/edit-plan/:id", hasToken.adminHasToken, planController.editPlan);
router.patch("/plan-action/:id", hasToken.adminHasToken, planController.listUnlistPlan);

// subscription
router.get("/subscriptions", hasToken.adminHasToken, subscriptionController.getSubscriptions);

// laborer request 
router.get("/requests", hasToken.adminHasToken, userController.getRequests);
router.get("/request/:id", hasToken.adminHasToken, userController.getRequest);
router.post("/request-action", hasToken.adminHasToken, userController.approveRejectAction);

// banner-related actions
router.get("/banners", hasToken.adminHasToken, bannerController.getBanners);
router.get("/banner/:id", hasToken.adminHasToken, bannerController.getBanner);
router.post(
    "/add-banner",
    hasToken.adminHasToken,
    uploadImage.single("image"),
    bannerController.addBanner
);
router.put(
    "/edit-banner/:id",
    hasToken.adminHasToken,
    uploadImage.single("image"),
    bannerController.editBanner
);
router.patch("/banner-action/:id", hasToken.adminHasToken, bannerController.listUnlistBanner);
router.patch("/update-banner-order", hasToken.adminHasToken, bannerController.updateBannerOrder);

// notifications
router.get("/notifications-count", hasToken.adminHasToken, notificationController.getAdminNotificationsCount);
router.get("/notifications/:page", hasToken.adminHasToken, notificationController.getAdminNotifications);
router.patch(
    "/notification/mark-read/:id",
    hasToken.adminHasToken,
    notificationController.markAdminNotificationRead
);

module.exports = router;
