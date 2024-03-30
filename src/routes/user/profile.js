const express = require("express");
const diskUpload = require("../../middlewares/imageUpload/diskUpload");
const { userHasToken } = require("../../middlewares/auth/hasToken");
const catchAsync = require("../../utils/errorHandling/catchAsync");

const router = express.Router();

const UserRepository = require("../../repositories/user");
const userRepository = new UserRepository();

const LaborerRepository = require("../../repositories/laborer");
const laborerRepository = new LaborerRepository();

const ProfileController = require("../../controllers/user/profile");
const ProfileService = require("../../services/user/profile");

const profileService = new ProfileService(userRepository, laborerRepository);
const profileController = new ProfileController(profileService);

// profile actions
router.put(
    "/update",
    userHasToken,
    diskUpload("profile").single("profile"),
    catchAsync(profileController.updateProfile.bind(profileController))
);
router.delete(
    "/delete-image",
    userHasToken,
    catchAsync(profileController.deleteProfileImage.bind(profileController))
);
router.get(
    "/current-location",
    userHasToken,
    catchAsync(profileController.getCurrentLocation.bind(profileController))
);
router.delete(
    "/:id/delete-current-location",
    userHasToken,
    catchAsync(profileController.deleteCurrentLocation.bind(profileController))
);
router.put(
    "/update-laborer",
    userHasToken,
    catchAsync(profileController.updateLaborerProfile.bind(profileController))
);

module.exports = router;
