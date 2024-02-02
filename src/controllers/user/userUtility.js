const userUtilityService = require("../../services/user/userUtility");
const catchAsync = require("../../utils/errorHandling/catchAsync");
const sendResponse = require("../../utils/responseStructure");

exports.getBanners = catchAsync(async (req, res) => {
    const result = await userUtilityService.getBanners();
    sendResponse(res, result);
});
