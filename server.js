const app = require("./app");
const mongoose = require("mongoose");
const logger = require("./src/utils/logger");

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
});

process.on("SIGINT", async () => {
    logger.info("Server shutting down...");

    try {
        await mongoose.connection.close();
        logger.info("Database connection closed successfully.");
    } catch (err) {
        logger.error("Error closing the database connection:", err);
    }

    server.close((err) => {
        if (err) {
            logger.error("Error closing the server:", err);
            process.exit(1); // Exit with error code
        }

        logger.info("Server shut down gracefully.");
        process.exit(0); // Exit with success code
    });
});
