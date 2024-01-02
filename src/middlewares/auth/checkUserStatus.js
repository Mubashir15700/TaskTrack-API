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
        console.error('Error checking user status:', error);

        // Provide a more meaningful error response
        return res.status(500).json({ message: 'Error checking user status', error: error.message });
    }
};

module.exports = checkUserStatus;
