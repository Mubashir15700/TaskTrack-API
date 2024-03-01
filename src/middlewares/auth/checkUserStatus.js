const jwt = require("jsonwebtoken");
const UserRepository = require("../../repositories/user");

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
        console.error("Error checking user status:", error);
        return {
            status: 500, message: `Internal Server Error: ${error.message}`
        };
    }
};

module.exports = checkUserStatus;
