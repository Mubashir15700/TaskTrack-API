const express = require("express");
const { adminHasToken } = require("../../middlewares/auth/hasToken");
const catchAsync = require("../../utils/errorHandling/catchAsync");

const router = express.Router();

const PlanController = require("../../controllers/admin/plan");
const PlanService = require("../../services/admin/plan");
const PlanRepository = require("../../repositories/plan");
const planRepository = new PlanRepository();

const planService = new PlanService(planRepository);
const planController = new PlanController(planService);

router.get("/", adminHasToken, catchAsync(planController.getPlans.bind(planController)));
router.get("/:id", adminHasToken, catchAsync(planController.getPlan.bind(planController)));
router.post("/add", adminHasToken, catchAsync(planController.addPlan.bind(planController)));
router.put("/:id/edit", adminHasToken, catchAsync(planController.editPlan.bind(planController)));
router.patch("/:id/list-unlist", adminHasToken, catchAsync(planController.listUnlistPlan.bind(planController)));

module.exports = router;
