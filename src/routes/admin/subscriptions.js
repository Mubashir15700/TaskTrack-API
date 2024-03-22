const express = require("express");
const { adminHasToken } = require("../../middlewares/auth/hasToken");
const catchAsync = require("../../utils/errorHandling/catchAsync");

const router = express.Router();

const SubscriptionController = require("../../controllers/admin/subscription");
const SubscriptionService = require("../../services/admin/subscription");
const SubscriptionRepository = require("../../repositories/subscription");
const subscriptionRepository = new SubscriptionRepository();

const subscriptionService = new SubscriptionService(subscriptionRepository);
const subscriptionController = new SubscriptionController(subscriptionService);

router.get("/", adminHasToken, catchAsync(subscriptionController.getSubscriptions.bind(subscriptionController)));

module.exports = router;
