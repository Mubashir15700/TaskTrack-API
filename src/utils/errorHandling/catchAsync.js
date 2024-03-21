const logger = require("../errorHandling/logger");

module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((error) => {
            logger.error("Internal Server Error: ", error);
            res.status(500).send({
                status: "failed",
                message: "Internal Server Error"
            });
        });
    };
};
