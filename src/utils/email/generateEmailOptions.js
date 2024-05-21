function generateEmailOptions(email, generatedOTP) {
    return {
        from: process.env.APP_EMAIL,
        to: email,
        subject: "TaskTrack Verification OTP",
        html: `<center>
            <h2>Verify Your Email</h2> <br>
            <h5>OTP: ${generatedOTP}</h5><br>
            <p>This OTP is only valid for 5 minutes</p>
        </center>`
    };
};

module.exports = generateEmailOptions;
