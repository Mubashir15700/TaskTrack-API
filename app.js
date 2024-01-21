require("dotenv").config();
const path = require("path");
const logger = require("./src/utils/logger");

// Check for required environment variables
const requiredEnvVariables = [
    "PORT",
    "CORS_ORIGIN",
    "DB_LOCAL_URL",
    "JWT_SECRET_KEY",
    "USER",
    "APP_PASSWORD"
];

for (const variable of requiredEnvVariables) {
    if (!process.env[variable]) {
        logger.error(`Missing environment variable: ${variable}`);
        process.exit(1);
    }
}

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const DBConnection = require("./db");
const userRoutes = require("./src/routes/user");
const adminRoutes = require("./src/routes/admin");
const utilityRoutes = require("./src/routes/utility");

const app = express();

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true
}));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).json({
        status: "failed",
        message: "Something went wrong!"
    });
});

app.use("/", userRoutes);
app.use("/admin", adminRoutes);
app.use("/utility", utilityRoutes);

DBConnection();

module.exports = app;
