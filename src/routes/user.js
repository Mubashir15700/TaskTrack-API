const express = require("express");
const bannerRoutes = require("./user/banners");
const chatRoutes = require("./user/chats");
const jobRoutes = require("./user/jobs");
const laborerRoutes = require("./user/laborers");
const notificationRoutes = require("./user/notifications");
const planRoutes = require("./user/plans");
const profileRoutes = require("./user/profile");
const subscriptionRoutes = require("./user/subscriptions");

const router = express.Router();

router.use("/banners", bannerRoutes);
router.use("/messages", chatRoutes);
router.use("/jobs", jobRoutes);
router.use("/laborers", laborerRoutes);
router.use("/request", laborerRoutes);
router.use("/notifications", notificationRoutes);
router.use("/plans", planRoutes);
router.use("/profile", profileRoutes);
router.use("/subscription", subscriptionRoutes);
router.use("/webhook", subscriptionRoutes);

module.exports = router;
