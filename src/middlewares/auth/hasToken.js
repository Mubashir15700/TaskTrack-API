const jwt = require("jsonwebtoken");

exports.userHasToken = async (req, res, next) => {
    const token = req.cookies.userJwt;
    if (!token) {
        return res.status(401).json({ status: "failed", message: "Unauthorized - Missing JWT" });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json({ status: "failed", message: "Unauthorized - Invalid JWT" });
    }
};

exports.adminHasToken = async (req, res, next) => {
    const token = req.cookies.adminJwt;

    if (!token) {
        return res.status(401).json({ status: "failed", message: "Unauthorized - Missing JWT" });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json({ status: "failed", message: "Unauthorized - Invalid JWT" });
    }
};
