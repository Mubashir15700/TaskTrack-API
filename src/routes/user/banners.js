const express = require("express");
const catchAsync = require("../../utils/errorHandling/catchAsync");

const router = express.Router();

const BannerRepository = require("../../repositories/banner");
const bannerRepository = new BannerRepository();

const ChatRepository = require("../../repositories/chat");
const chatRepository = new ChatRepository();

const UserUtilityController = require("../../controllers/user/userUtility");
const UserUtilityService = require("../../services/user/userUtility");

const userUtilityService = new UserUtilityService(bannerRepository, chatRepository);
const userUtilityController = new UserUtilityController(userUtilityService);

// home page
router.get("/", catchAsync(userUtilityController.getBanners.bind(userUtilityController)));

module.exports = router;
