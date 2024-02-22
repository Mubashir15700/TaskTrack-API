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
router.get("/users/:id", hasToken.adminHasToken, userController.getUser);
router.post("/users/:id/block-unblock", hasToken.adminHasToken, userController.blockUnblockUser);

// plan-related actions
router.get("/plans", hasToken.adminHasToken, planController.getPlans);
router.get("/plans/:id", hasToken.adminHasToken, planController.getPlan);
router.post("/plans/add-plan", hasToken.adminHasToken, planController.addPlan);
router.put("/plans/:id/edit-plan", hasToken.adminHasToken, planController.editPlan);
router.patch("/plans/:id/list-unlist", hasToken.adminHasToken, planController.listUnlistPlan);

// subscription
router.get("/subscriptions", hasToken.adminHasToken, subscriptionController.getSubscriptions);

// laborer request 
router.get("/requests", hasToken.adminHasToken, userController.getRequests);
router.get("/requests/:id", hasToken.adminHasToken, userController.getRequest);
router.post("/requests/list-unlist", hasToken.adminHasToken, userController.approveRejectAction);

// banner-related actions
router.get("/banners", hasToken.adminHasToken, bannerController.getBanners);
router.get("/banners/:id", hasToken.adminHasToken, bannerController.getBanner);
router.post(
    "/banners/add-banner",
    hasToken.adminHasToken,
    uploadImage.single("image"),
    bannerController.addBanner
);
router.put(
    "/banners/:id/edit-banner",
    hasToken.adminHasToken,
    uploadImage.single("image"),
    bannerController.editBanner
);
router.patch("/banners/:id/list-unlist", hasToken.adminHasToken, bannerController.listUnlistBanner);
router.patch("/banners/update-order", hasToken.adminHasToken, bannerController.updateBannerOrder);

// notifications
router.get("/notifications/count", hasToken.adminHasToken, notificationController.getAdminNotificationsCount);
router.get("/notifications/:page", hasToken.adminHasToken, notificationController.getAdminNotifications);
router.patch(
    "/notifications/:id/mark-read",
    hasToken.adminHasToken,
    notificationController.markAdminNotificationRead
);

module.exports = router;
