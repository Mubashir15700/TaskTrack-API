const express = require("express");
const hasToken = require("../../middlewares/auth/hasToken");
const catchAsync = require("../../utils/errorHandling/catchAsync");

const router = express.Router();

const DashboardController = require("../../controllers/admin/dashboard");
const DashboardService = require("../../services/admin/dashboard");

const UserRepository = require("../../repositories/user");
const userRepository = new UserRepository();

const dashboardService = new DashboardService(userRepository);
const dashboardController = new DashboardController(dashboardService);

router.get("/", hasToken.adminHasToken, catchAsync(dashboardController.getData.bind(dashboardController)));

module.exports = router;
