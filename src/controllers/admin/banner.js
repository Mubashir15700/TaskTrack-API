const bannerService = require("../../services/admin/banner");
const catchAsync = require("../../utils/catchAsync");
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
    const bannerImage = req.file ? req.file.filename : null;
    const result = await bannerService.addBanner(
        title, description, bannerImage
    );
    sendResponse(res, result);
});

exports.editBanner = catchAsync(async (req, res) => {
    const { id, title, description } = req.body;
    const bannerImage = req.file ? req.file.filename : null;
    const result = await bannerService.editBanner(id, title, description, bannerImage);
    sendResponse(res, result);
});

exports.listUnlistBanner = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await bannerService.listUnlistBanner(id);
    sendResponse(res, result);
});
