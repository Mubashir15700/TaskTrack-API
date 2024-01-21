const express = require("express");
const authController = require("../controllers/auth");
const notificationController = require("../controllers/notification");
const userController = require("../controllers/admin/user");
const bannerController = require("../controllers/admin/banner");
const planController = require("../controllers/admin/plan");
const hasToken = require("../middlewares/auth/hasToken");
const imageUpload = require("../middlewares/imageUpload");

const router = express.Router();

// authentication and login
router.get("/auth/checkauth", authController.checkAuth);
router.post("/login", authController.adminLogin);

// user-related actions
router.get("/users", hasToken.adminHasToken, userController.getUsers);
router.get("/user/:id", hasToken.adminHasToken, userController.getUser);
router.patch("/user-action/:id", hasToken.adminHasToken, userController.blockUnblockUser);

// banner-related actions
router.get("/banners", hasToken.adminHasToken, bannerController.getBanners);
router.get("/banner/:id", hasToken.adminHasToken, bannerController.getBanner);
router.post("/add-banner", hasToken.adminHasToken, imageUpload("banner").single("image"), bannerController.addBanner);
router.put("/edit-banner/:id", hasToken.adminHasToken, imageUpload("banner").single("image"), bannerController.editBanner);
router.patch("/banner-action/:id", hasToken.adminHasToken, bannerController.listUnlistBanner);

// plan-related actions
router.get("/plans", hasToken.adminHasToken, planController.getPlans);
router.get("/plan/:id", hasToken.adminHasToken, planController.getPlan);
router.post("/add-plan", hasToken.adminHasToken, planController.addPlan);
router.put("/edit-plan/:id", hasToken.adminHasToken, planController.editPlan);
router.patch("/plan-action/:id", hasToken.adminHasToken, planController.listUnlistPlan);

// laborer request 
router.get("/requests", hasToken.adminHasToken, userController.getRequests);
router.get("/request/:id", hasToken.adminHasToken, userController.getRequest);
router.patch("/request-action/:id", hasToken.adminHasToken, userController.approveRejectAction);

// notifications
router.get("/notifications-count", hasToken.adminHasToken, notificationController.getAdminNotificationsCount);
router.get("/notifications", hasToken.adminHasToken, notificationController.getAdminNotifications);
router.patch("/notification/mark-read/:id", hasToken.adminHasToken, notificationController.markAdminNotificationRead);

module.exports = router;
