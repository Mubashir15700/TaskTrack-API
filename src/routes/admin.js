const express = require("express");
const dashboardRoutes = require("./admin/dashboard");
const userRoutes = require("./admin/users");
const planRoutes = require("./admin/plans");
const subscriptionRoutes = require("./admin/subscriptions");
const bannerRoutes = require("./admin/banners");
const notificationRoutes = require("./admin/notifications");
const requestRoutes = require("./admin/requests");

const router = express.Router();

router.use("/dashboard", dashboardRoutes);
router.use("/users", userRoutes);
router.use("/plans", planRoutes);
router.use("/subscriptions", subscriptionRoutes);
router.use("/banners", bannerRoutes);
router.use("/notifications", notificationRoutes);
router.use("/requests", requestRoutes);

module.exports = router;
