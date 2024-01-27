const winston = require("winston");

// Winston setup
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: "combined.log",
            maxsize: 1048576, // 1 MB (you can adjust the size as needed)
            maxFiles: 5 // Number of files to keep before rotating
        })
    ]
});

module.exports = logger;
