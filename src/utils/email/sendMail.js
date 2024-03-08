const nodemailer = require("nodemailer");
const logger = require("../errorHandling/logger");

const sendMail = async (options) => {

    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.APP_PASSWORD
        }
    });
    
    transporter.sendMail(options, (error, info) => {
        if (error) {
            logger.error("Error: ", error);
        } else {
            logger.info("Email sent: ", info.response);
            res.status(200).send({ message: "success" });
        }
    });
};

module.exports = sendMail;
