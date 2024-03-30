const jwt = require("jsonwebtoken");
const UserRepository = require("../../repositories/user");
const logger = require("../../utils/errorHandling/logger");

const userRepository = new UserRepository();

const checkToken = async (token, req, res, next) => {
    if (!token) {
        return res.status(401).json({ status: "failed", message: "Unauthorized - Missing JWT" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (decoded.role === "user") {
            const currentUser = await userRepository.findCurrentUserById(decoded.userId);

            if (currentUser && currentUser.isBlocked) {
                res.clearCookie("userJwt");
                return res.status(401).json({ status: "failed", message: "Unauthorized - User is blocked" });
            }
        }

        req.user = decoded;
        next();
    } catch (error) {
        // Log the error
        logger.error("Error checking user has token: ", error);

        if (error instanceof jwt.TokenExpiredError) {
            res.clearCookie("userJwt");
            return res.status(401).json({ status: "failed", message: "Unauthorized - Token expired" });
        }

        next(error);
    }
};

exports.userHasToken = async (req, res, next) => {
    const token = req.cookies.userJwt;
    return checkToken(token, req, res, next);
};

exports.adminHasToken = async (req, res, next) => {
    const token = req.cookies.adminJwt;
    return checkToken(token, req, res, next);
};
