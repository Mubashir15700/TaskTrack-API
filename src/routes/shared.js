const express = require("express");
const catchAsync = require("../utils/errorHandling/catchAsync");

const router = express.Router();

const UtilityController = require("../controllers/utility");
const UtilityService = require("../services/utility");
const UserRepository = require("../repositories/user");
const LaborerRepository = require("../repositories/laborer");
const JobRepository = require("../repositories/job");
const BannerRepository = require("../repositories/banner");
const PlanRepository = require("../repositories/plan");

const userRepository = new UserRepository();
const laborerRepository = new LaborerRepository();
const jobRepository = new JobRepository();
const bannerRepository = new BannerRepository();
const planRepository = new PlanRepository();
const utilityService = new UtilityService(userRepository, laborerRepository, jobRepository, bannerRepository, planRepository);
const utilityController = new UtilityController(utilityService);

// search
router.get("/search", catchAsync(utilityController.search.bind(utilityController)));

module.exports = router;
