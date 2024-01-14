const express = require("express");
const authController = require("../controllers/authController");
const adminUtilityController = require("../controllers/adminController/adminUtilityController");
const userController = require("../controllers/adminController/userController");
const bannerController = require("../controllers/adminController/bannerController");
const planController = require("../controllers/adminController/planController");
const hasToken = require("../middlewares/auth/hasToken");
const imageUpload = require("../middlewares/imageUpload");

const router = express.Router();

// authentication and login
router.get("/auth/checkauth", authController.checkAuth);
router.post("/login", authController.adminLogin);

// search
router.get("/search", hasToken.adminHasToken, adminUtilityController.search);

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

module.exports = router;
