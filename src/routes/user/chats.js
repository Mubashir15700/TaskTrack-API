const express = require("express");
const { userHasToken } = require("../../middlewares/auth/hasToken");
const catchAsync = require("../../utils/errorHandling/catchAsync");

const router = express.Router();

const BannerRepository = require("../../repositories/banner");
const bannerRepository = new BannerRepository();

const ConversationRepository = require("../../repositories/conversation");
const conversationRepository = new ConversationRepository();

const ChatRepository = require("../../repositories/chat");
const chatRepository = new ChatRepository();

const UserUtilityController = require("../../controllers/user/userUtility");
const UserUtilityService = require("../../services/user/userUtility");

const userUtilityService = new UserUtilityService(bannerRepository, chatRepository, conversationRepository);
const userUtilityController = new UserUtilityController(userUtilityService);

router.get(
    "/",
    userHasToken,
    catchAsync(userUtilityController.getChatLists.bind(userUtilityController))
);

router.patch(
    "/mark-read/",
    userHasToken,
    catchAsync(userUtilityController.updateMessagesReadStatus.bind(userUtilityController))
);

module.exports = router;
