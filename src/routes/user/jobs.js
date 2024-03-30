const express = require("express");
const { userHasToken } = require("../../middlewares/auth/hasToken");
const catchAsync = require("../../utils/errorHandling/catchAsync");

const router = express.Router();

const ReasonRepository = require("../../repositories/reason");
const reasonRepository = new ReasonRepository();

const JobRepository = require("../../repositories/job");
const jobRepository = new JobRepository();

const SubscriptionRepository = require("../../repositories/subscription");
const subscriptionRepository = new SubscriptionRepository();

const JobController = require("../../controllers/user/job");
const JobService = require("../../services/user/job");

const jobService = new JobService(jobRepository, reasonRepository, subscriptionRepository);
const jobController = new JobController(jobService);

// job actions
router.post("/posts/new", userHasToken, catchAsync(jobController.postJob.bind(jobController)));
router.get("/listed/:id/:page", userHasToken, catchAsync(jobController.getListedJobs.bind(jobController)));
router.get("/listed/:id", userHasToken, catchAsync(jobController.getListedJob.bind(jobController)));
router.put("/listed/edit", userHasToken, catchAsync(jobController.editListedJob.bind(jobController)));
router.post("/apply", userHasToken, catchAsync(jobController.applyJob.bind(jobController)));
router.post("/cancel-application", userHasToken, catchAsync(jobController.cancelJobApplication.bind(jobController)));
router.get("/posts/remaining", userHasToken, catchAsync(jobController.getRemainingPosts.bind(jobController)));
router.delete("/listed/:id/delete", userHasToken, catchAsync(jobController.deleteListedJob.bind(jobController)));
router.get("/applicants/:id/:field", userHasToken, catchAsync(jobController.getApplicants.bind(jobController)));
router.patch("/applicant-action", userHasToken, catchAsync(jobController.takeApplicantAction.bind(jobController)));
router.get("/works-history/:id/:page", userHasToken, catchAsync(jobController.getWorksHistory.bind(jobController)));
router.get("/:id/:page", catchAsync(jobController.getJobs.bind(jobController)));
router.get("/:id", catchAsync(jobController.getJob.bind(jobController)));

module.exports = router;
