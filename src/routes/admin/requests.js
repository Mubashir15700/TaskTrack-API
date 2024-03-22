const express = require("express");
const { adminHasToken } = require("../../middlewares/auth/hasToken");
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

// laborer request 
router.get("/", adminHasToken, catchAsync(userController.getRequests.bind(userController)));
router.get("/:id", adminHasToken, catchAsync(userController.getRequest.bind(userController)));
router.post("/list-unlist", adminHasToken, catchAsync(userController.approveRejectAction.bind(userController)));

module.exports = router;
