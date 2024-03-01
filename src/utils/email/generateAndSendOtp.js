const crypto = require("crypto");
const userRepository = require("../../repositories/user");
const generateEmailOptions = require("./generateEmailOptions");
const sendMail = require("./sendMail");

async function generateAndSendOtp(email, errorMessage) {
    try {
        const generatedOTP = crypto.randomInt(100000, 999999);
        await userRepository.findUserAndUpdateOtp(email, generatedOTP);
        const emailOptions = generateEmailOptions(email, generatedOTP);
        await sendMail(emailOptions);
    } catch (error) {
        console.error(errorMessage, error);
        throw new Error(errorMessage);
    }
};

module.exports = generateAndSendOtp;
