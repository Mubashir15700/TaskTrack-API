const authService = require("../../services/auth");
const authRepository = require("../../repositories/auth");

const checkUserStatus = async (req, res, next) => {
    try {
        const token = req.cookies.userJwt;

        if (token) {
            const decodedToken = await authService.decodeToken(token);
            const currentUser = await authRepository.findCurrentUserById(decodedToken.userId);

            if (currentUser && currentUser.isBlocked) {
                res.clearCookie("userJwt");
            }
        }

        next();
    } catch (error) {
        console.error("Error checking user status:", error);
        return {
            status: 500, message: `Internal Server Error: ${error.message}`
        };
    }
};

module.exports = checkUserStatus;
