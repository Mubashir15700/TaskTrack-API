const express = require("express");
const checkUserStatus = require("../../middlewares/auth/checkUserStatus");
const hasToken = require("../../middlewares/auth/hasToken");
const catchAsync = require("../../utils/errorHandling/catchAsync");

const router = express.Router();

const PlanRepository = require("../../repositories/plan");
const planRepository = new PlanRepository();

const PlanController = require("../../controllers/user/plan");
const PlanService = require("../../services/user/plan");

const planService = new PlanService(planRepository);
const planController = new PlanController(planService);

// plans
router.get("/", checkUserStatus, hasToken.userHasToken, catchAsync(planController.getPlans.bind(planController)));

module.exports = router;
