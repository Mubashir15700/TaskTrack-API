const jwt = require("jsonwebtoken");

async function generateToken(userId, role) {
    return await jwt.sign(
        { userId, role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "7d" }
    );
};

module.exports = generateToken;
