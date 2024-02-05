const subscriptionService = require("../../services/admin/subscription");
const catchAsync = require("../../utils/errorHandling/catchAsync");
const sendResponse = require("../../utils/responseStructure");

exports.getSubscriptions = catchAsync(async (req, res) => {
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
    const currentPage = parseInt(req.query.currentPage);
    const result = await subscriptionService.getSubscriptions(itemsPerPage, currentPage);
    sendResponse(res, result);
});
