const crypto = require("crypto");
const authRepository = require("../repositories/auth");
const generateEmailOptions = require("./generateEmailOptions");
const sendMail = require("./sendMail");

async function generateAndSendOtp(email) {
    const generatedOTP = crypto.randomInt(100000, 999999);
    await authRepository.findUserAndUpdateOtp(email, generatedOTP);
    const emailOptions = generateEmailOptions(email, generatedOTP);
    await sendMail(emailOptions);
};

module.exports = generateAndSendOtp;
