const express = require("express");
const { adminHasToken } = require("../../middlewares/auth/hasToken");
const { uploadImage } = require("../../middlewares/imageUpload/s3Upload");
const catchAsync = require("../../utils/errorHandling/catchAsync");

const router = express.Router();

const BannerController = require("../../controllers/admin/banner");
const BannerService = require("../../services/admin/banner");
const BannerRepository = require("../../repositories/banner");
const bannerRepository = new BannerRepository();

const bannerService = new BannerService(bannerRepository);
const bannerController = new BannerController(bannerService);

// banner-related actions
router.get("/", adminHasToken, catchAsync(bannerController.getBanners.bind(bannerController)));
router.get("/:id", adminHasToken, catchAsync(bannerController.getBanner.bind(bannerController)));
router.post(
    "/add-banner",
    adminHasToken,
    uploadImage.single("image"),
    catchAsync(bannerController.addBanner.bind(bannerController))
);
router.put(
    "/:id/edit-banner",
    adminHasToken,
    uploadImage.single("image"),
    catchAsync(bannerController.editBanner.bind(bannerController))
);
router.patch("/:id/list-unlist", adminHasToken, catchAsync(bannerController.listUnlistBanner.bind(bannerController)));
router.patch("/update-order", adminHasToken, catchAsync(bannerController.updateBannerOrder.bind(bannerController)));

module.exports = router;
