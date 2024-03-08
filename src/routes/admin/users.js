const express = require("express");
const hasToken = require("../../middlewares/auth/hasToken");
const catchAsync = require("../../utils/errorHandling/catchAsync");

const router = express.Router();

const UserController = require("../../controllers/admin/user");
const UserService = require("../../services/admin/user");
const UserRepository = require("../../repositories/user");
const userRepository = new UserRepository();

const LaborerRepository = require("../../repositories/laborer");
const laborerRepository = new LaborerRepository();

const ReasonRepository = require("../../repositories/reason");
const reasonRepository = new ReasonRepository();

const RequestRepository = require("../../repositories/request");
const requestRepository = new RequestRepository();

const userService = new UserService(userRepository, laborerRepository, requestRepository, reasonRepository);
const userController = new UserController(userService);

// user-related actions
router.get("/", hasToken.adminHasToken, catchAsync(userController.getUsers.bind(userController)));
router.get("/:id", hasToken.adminHasToken, catchAsync(userController.getUser.bind(userController)));
router.post("/:id/block-unblock", hasToken.adminHasToken, catchAsync(userController.blockUnblockUser.bind(userController)));

module.exports = router;
