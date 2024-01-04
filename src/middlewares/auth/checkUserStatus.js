const authService = require("../../services/authService");
const authRepository = require("../../repositories/authRepository");

const checkUserStatus = async (req, res, next) => {
    try {
        const token = req.cookies.userJwt;

        if (token) {
            const decodedToken = await authService.decodeToken(token);
            const currentUser = await authRepository.findCurrentUserById(decodedToken.userId);

            if (currentUser && currentUser.isBlocked) {
                // If the user is blocked, clear the cookie
                res.clearCookie("userJwt");
            }
        }

        // Continue to the next middleware or route handler
        next();
    } catch (error) {
        console.error("Error checking user status:", error);
        return {
            status: 500, message: `Internal Server Error: ${error.message}`
        };
    }
};

module.exports = checkUserStatus;
