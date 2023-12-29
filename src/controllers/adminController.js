const adminService = require('../services/adminService');
const catchAsync = require('../utils/catchAsync');

exports.getUsers = catchAsync(async (req, res) => {
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
    const currentPage = parseInt(req.query.currentPage);

    const result = await adminService.getUsers(itemsPerPage, currentPage);

    res.status(result.status).json({
        status: result.status === 201 ? 'success' : 'failed',
        message: result.message,
        users: result.users,
        totalPages: result.totalPages
    });
});

exports.getUser = catchAsync(async (req, res) => {
    const { id } = req.params;

    const result = await adminService.getUser(id);

    res.status(result.status).json({
        status: result.status === 201 ? 'success' : 'failed',
        message: result.message,
        user: result.user
    });
});