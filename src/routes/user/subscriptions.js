const express = require("express");
const checkUserStatus = require("../../middlewares/auth/checkUserStatus");
const hasToken = require("../../middlewares/auth/hasToken");
const catchAsync = require("../../utils/errorHandling/catchAsync");

const router = express.Router();

const UserRepository = require("../../repositories/user");
const userRepository = new UserRepository();

const SubscriptionRepository = require("../../repositories/subscription");
const subscriptionRepository = new SubscriptionRepository();

const SubscriptionController = require("../../controllers/user/subscription");
const SubscriptionService = require("../../services/user/subscription");
const subscriptionService = new SubscriptionService(subscriptionRepository, userRepository);
const subscriptionController = new SubscriptionController(subscriptionService);

// subscriptions
router.get("/stripe-public-key", catchAsync(subscriptionController.getStripePublicKey.bind(subscriptionController)));
router.post("/create", catchAsync(subscriptionController.createSubscription.bind(subscriptionController)));
router.post("/save", catchAsync(subscriptionController.saveSubscriptionResult.bind(subscriptionController)));
router.get("/active-plan", catchAsync(subscriptionController.getActivePlan.bind(subscriptionController)));
// webhook
router.post("/", express.raw({ type: "application/json" }), catchAsync(subscriptionController.testWebhook.bind(subscriptionController)));

module.exports = router;
