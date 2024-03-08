const express = require("express");
const hasToken = require("../../middlewares/auth/hasToken");
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
router.get("/", hasToken.adminHasToken, catchAsync(bannerController.getBanners.bind(bannerController)));
router.get("/:id", hasToken.adminHasToken, catchAsync(bannerController.getBanner.bind(bannerController)));
router.post(
    "/add-banner",
    hasToken.adminHasToken,
    uploadImage.single("image"),
    catchAsync(bannerController.addBanner.bind(bannerController))
);
router.put(
    "/:id/edit-banner",
    hasToken.adminHasToken,
    uploadImage.single("image"),
    catchAsync(bannerController.editBanner.bind(bannerController))
);
router.patch("/:id/list-unlist", hasToken.adminHasToken, catchAsync(bannerController.listUnlistBanner.bind(bannerController)));
router.patch("/update-order", hasToken.adminHasToken, catchAsync(bannerController.updateBannerOrder.bind(bannerController)));

module.exports = router;
