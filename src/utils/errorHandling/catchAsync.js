const logger = require("../errorHandling/logger");

module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((err) => {
            logger.error("Internal error: ", err);
            res.status(500).send({
                status: "failed",
                message: "Internal Server Error"
            });
        });
    };
};
