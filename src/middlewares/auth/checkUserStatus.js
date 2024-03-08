const jwt = require("jsonwebtoken");
const UserRepository = require("../../repositories/user");
const logger = require("../../utils/errorHandling/logger");

const userRepository = new UserRepository();

const checkUserStatus = async (req, res, next) => {
    try {
        const token = req.cookies.userJwt;

        if (token) {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

            const currentUser = await userRepository.findCurrentUserById(decodedToken.userId);

            if (currentUser && currentUser.isBlocked) {
                res.clearCookie("userJwt");
            }
        }

        next();
    } catch (error) {
        // Log the error
        logger.error("Error checking user status:", error.message);

        // Pass the error to the next middleware or the global error handler
        next(error);
    }
};

module.exports = checkUserStatus;
