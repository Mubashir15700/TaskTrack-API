const utilityService = require("../services/utility");
const catchAsync = require("../utils/errorHandling/catchAsync");
const sendResponse = require("../utils/responseStructure");

exports.search = catchAsync(async (req, res) => {
    const { currentUserId, searchWith, searchOn } = req.query;
    const result = await utilityService.search(currentUserId, searchWith, searchOn);
    sendResponse(res, result);
});
