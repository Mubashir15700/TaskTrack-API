const express = require("express");
const { userHasToken } = require("../../middlewares/auth/hasToken");
const catchAsync = require("../../utils/errorHandling/catchAsync");

const router = express.Router();

const UserRepository = require("../../repositories/user");
const userRepository = new UserRepository();

const RequestRepository = require("../../repositories/request");
const requestRepository = new RequestRepository();

const ReasonRepository = require("../../repositories/reason");
const reasonRepository = new ReasonRepository();

const LaborerRepository = require("../../repositories/laborer");
const laborerRepository = new LaborerRepository();

const LaborerController = require("../../controllers/user/laborer");
const LaborerService = require("../../services/user/laborer");

const laborerService = new LaborerService(userRepository, laborerRepository, requestRepository, reasonRepository);
const laborerController = new LaborerController(laborerService);

// laborer request
router.post("/send", userHasToken, catchAsync(laborerController.sendRequest.bind(laborerController)));
router.get("/pending/:id", userHasToken, catchAsync(laborerController.getPrevRequest.bind(laborerController)));
router.put("/update", userHasToken, catchAsync(laborerController.updateRequest.bind(laborerController)));
router.patch("/cancel", userHasToken, catchAsync(laborerController.cancelRequest.bind(laborerController)));

// laborer actions
router.get("/:id/:page", catchAsync(laborerController.getLaborers.bind(laborerController)));
router.get("/:id", catchAsync(laborerController.getLaborer.bind(laborerController)));

module.exports = router;
