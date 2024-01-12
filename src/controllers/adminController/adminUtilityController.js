const adminUtilityService = require("../../services/adminService/adminUtilityService");
const catchAsync = require("../../utils/catchAsync");
const sendResponse = require("../../utils/responseStructure");

exports.search = catchAsync(async (req, res) => {
    const { searchWith, searchOn } = req.query;
    const result = await adminUtilityService.search(searchWith, searchOn);
    sendResponse(res, result);
});
