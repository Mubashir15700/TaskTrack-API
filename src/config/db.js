const mongoose = require("mongoose");
const logger = require("../utils/errorHandling/logger");

let isConnected = false; // Flag to track connection status

const DBConnection = async () => {
    try {
        const URL = process.env.DB_URL;

        mongoose.set("strictQuery", false);

        if (!isConnected) {
            mongoose.connection.on("connected", () => {
                logger.info("Connected to the database successfully.");
                isConnected = true; // Set isConnected to true on successful connection
            });

            mongoose.connection.on("error", (err) => {
                logger.error("MongoDB connection error:", err);
            });

            mongoose.connection.on("disconnected", () => {
                logger.info("MongoDB disconnected");
                isConnected = false; // Reset isConnected on disconnection
            });
        }

        await mongoose.connect(URL);

        if (!isConnected) {
            logger.info("Connected to the database successfully.");
        }
    } catch (error) {
        logger.error("Error connecting to the database:", error);
    }
};

module.exports = DBConnection;
