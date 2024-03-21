const app = require("./app");
const mongoose = require("mongoose");
const { initializeSocket } = require("./src/sockets");
const logger = require("./src/utils/errorHandling/logger");

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
});

process.on("SIGINT", async () => {
    logger.info("Server shutting down...");

    await mongoose.connection.close();

    server.close((err) => {
        if (err) {
            logger.error("Error closing the server:", err);
            process.exit(1); // Exit with error code
        }

        logger.info("Server shut down gracefully.");
        process.exit(0); // Exit with success code
    });
});

initializeSocket(server);
