const authService = require('../../services/authService');

const hasToken = async (req, res, next) => {
    const token = req.cookies.userJwt;

    if (!token) {
        return res.status(401).json({ status: "failed", message: 'Unauthorized - Missing JWT' });
    }

    try {
        const decodedToken = await authService.decodeToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json({ status: "failed", message: 'Unauthorized - Invalid JWT' });
    }
};

module.exports = hasToken;
