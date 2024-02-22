const bannerService = require("../../services/admin/banner");
const catchAsync = require("../../utils/errorHandling/catchAsync");
const sendResponse = require("../../utils/responseStructure");

exports.getBanners = catchAsync(async (req, res) => {
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
    const currentPage = parseInt(req.query.currentPage);
    const result = await bannerService.getBanners(itemsPerPage, currentPage);
    sendResponse(res, result);
});

exports.getBanner = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await bannerService.getBanner(id);
    sendResponse(res, result);
});

exports.addBanner = catchAsync(async (req, res) => {
    const { title, description } = req.body;
    const { key } = req.file;
    const result = await bannerService.addBanner(
        title, description, key
    );
    sendResponse(res, result);
});

exports.editBanner = catchAsync(async (req, res) => {
    const { id, title, description } = req.body;
    const { key } = req.file;
    const result = await bannerService.editBanner(
        id, title, description, key
    );
    sendResponse(res, result);
});

exports.listUnlistBanner = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await bannerService.listUnlistBanner(id);
    sendResponse(res, result);
});

exports.updateBannerOrder = catchAsync(async (req, res) => {
    const { data } = req.body;
    const result = await bannerService.updateBannerOrder(data);
    sendResponse(res, result);
});
