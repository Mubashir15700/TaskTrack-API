const userUtilityService = require("../../services/userService/userUtilityService");
const catchAsync = require("../../utils/catchAsync");
const sendResponse = require("../../utils/responseStructure");

exports.getBanners = catchAsync(async (req, res) => {
    const result = await userUtilityService.getBanners();
    sendResponse(res, result);
});
