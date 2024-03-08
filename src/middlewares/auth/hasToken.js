const jwt = require("jsonwebtoken");
const logger = require("../../utils/errorHandling/logger");

const checkToken = (token, req, res, next) => {
    if (!token) {
        return res.status(401).json({ status: "failed", message: "Unauthorized - Missing JWT" });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decodedToken;
        next();
    } catch (error) {
        // Log the error
        logger.error("Error checking user has token:", error.message);

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
