const express = require("express");
const hasToken = require("../../middlewares/auth/hasToken");
const catchAsync = require("../../utils/errorHandling/catchAsync");

const router = express.Router();

const PlanController = require("../../controllers/admin/plan");
const PlanService = require("../../services/admin/plan");
const PlanRepository = require("../../repositories/plan");
const planRepository = new PlanRepository();

const planService = new PlanService(planRepository);
const planController = new PlanController(planService);

router.get("/", hasToken.adminHasToken, catchAsync(planController.getPlans.bind(planController)));
router.get("/:id", hasToken.adminHasToken, catchAsync(planController.getPlan.bind(planController)));
router.post("/add", hasToken.adminHasToken, catchAsync(planController.addPlan.bind(planController)));
router.put("/:id/edit", hasToken.adminHasToken, catchAsync(planController.editPlan.bind(planController)));
router.patch("/:id/list-unlist", hasToken.adminHasToken, catchAsync(planController.listUnlistPlan.bind(planController)));

module.exports = router;
