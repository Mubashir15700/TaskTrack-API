const express = require("express");
const authController = require("../controllers/authController");
const adminController = require("../controllers/adminController/adminController");
const userController = require("../controllers/adminController/userController");
const bannerController = require("../controllers/adminController/bannerController");
const planController = require("../controllers/adminController/planController");
const imageUpload = require("../middlewares/imageUpload");

const router = express.Router();

// authentication and login
router.post("/auth/checkauth", authController.checkAuth);
router.post("/login", authController.adminLogin);

// search
router.post("/search", adminController.search);

// user-related actions
router.get("/users", userController.getUsers);
router.get("/user/:id", userController.getUser);
router.post("/user-action/:id", userController.blockUnblockUser);

// banner-related actions
router.get("/banners", bannerController.getBanners);
router.get("/banner/:id", bannerController.getBanner);
router.post("/add-banner", imageUpload("banner").single("image"), bannerController.addBanner);
router.post("/edit-banner/:id", imageUpload("banner").single("image"), bannerController.editBanner);
router.post("/banner-action/:id", bannerController.listUnlistBanner);

// plan-related actions
router.get("/plans", planController.getPlans);
router.get("/plan/:id", planController.getPlan);
router.post("/add-plan", planController.addPlan);
router.post("/edit-plan/:id", planController.editPlan);
router.post("/plan-action/:id", planController.listUnlistPlan);

module.exports = router;
