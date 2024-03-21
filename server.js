const app = require("./app");
const { connectToDatabase, disconnectFromDatabase } = require("./src/config/db");
const { initializeSocket } = require("./src/sockets");
const logger = require("./src/utils/errorHandling/logger");

const port = process.env.PORT || 3000; // Set default port if PORT environment variable is not provided

// Connect to the database first
connectToDatabase().then(() => {
    // Start the server only after the database connection is established
    const server = app.listen(port, () => {
        logger.info(`Server running on port ${port}`);

        // Log important information or instructions
        logger.info("Press Ctrl+C to gracefully shut down the server.");
    });

    initializeSocket(server);

    // Handle graceful shutdown on SIGINT and SIGTERM signals
    const handleShutdown = async () => {
        logger.info("Server shutting down...");

        await disconnectFromDatabase();

        server.close((err) => {
            if (err) {
                logger.error("Error closing the server:", err);
                process.exit(1); // Exit with error code
            }

            logger.info("Server shut down gracefully.");
            process.exit(0); // Exit with success code
        });
    };

    // Listen for SIGINT and SIGTERM signals to gracefully shut down the server
    process.on("SIGINT", handleShutdown);
    process.on("SIGTERM", handleShutdown);
}).catch((error) => {
    logger.error("Error connecting to the database:", error);
});
