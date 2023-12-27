const nodemailer = require('nodemailer');

const sendMail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.USER,
            pass: process.env.APP_PASSWORD
        }
    });
    transporter.sendMail(options, (error, info) => {
        if (error) {
            console.error('Error:', error);
        } else {
            console.log('Email sent:', info.response);
            res.status(200).send({ message: "success" });
        }
    });
};

module.exports = sendMail;