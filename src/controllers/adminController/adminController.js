const adminService = require("../../services/adminService/adminService");
const catchAsync = require("../../utils/catchAsync");
const sendResponse = require("../../utils/responseStructure");

exports.search = catchAsync(async (req, res) => {
    const { searchWith, searchOn } = req.body;
    const result = await adminService.search(searchWith, searchOn);
    sendResponse(res, result);
});
