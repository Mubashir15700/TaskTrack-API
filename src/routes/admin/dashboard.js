const express = require("express");
const { adminHasToken } = require("../../middlewares/auth/hasToken");
const catchAsync = require("../../utils/errorHandling/catchAsync");

const router = express.Router();

const DashboardController = require("../../controllers/admin/dashboard");
const DashboardService = require("../../services/admin/dashboard");

const UserRepository = require("../../repositories/user");
const userRepository = new UserRepository();

const JobRepository = require("../../repositories/job");
const jobRepository = new JobRepository();

const SubscriptionRepository = require("../../repositories/subscription");
const subscriptionRepository = new SubscriptionRepository();

const dashboardService = new DashboardService(userRepository, jobRepository, subscriptionRepository);
const dashboardController = new DashboardController(dashboardService);

router.get("/", adminHasToken, catchAsync(dashboardController.getData.bind(dashboardController)));

module.exports = router;
