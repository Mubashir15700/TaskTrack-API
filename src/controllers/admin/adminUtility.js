const adminUtilityService = require("../../services/admin/adminUtility");
const catchAsync = require("../../utils/catchAsync");
const sendResponse = require("../../utils/responseStructure");

exports.search = catchAsync(async (req, res) => {
    const { currentUserId, searchWith, searchOn } = req.query;
    const result = await adminUtilityService.search(currentUserId, searchWith, searchOn);
    sendResponse(res, result);
});
