require("dotenv").config();
const path = require("path");
const logger = require("./src/utils/errorHandling/logger");

// Check for required environment variables
const requiredEnvVariables = [
    "PORT",
    "DB_URL",
    "CORS_ORIGIN",
    "SOCKET_PING_TIMEOUT",
    "GOOGLE_CLIENT_ID",
    "JWT_SECRET_KEY",
    "OPENCAGE_API_KEY",
    "STRIPE_PUBLIC_KEY",
    "STRIPE_SECRET_KEY",
    "BUCKET_NAME",
    "REGION",
    "ACCESS_KEY",
    "SECRET_ACCESS_KEY",
    "EMAIL",
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
const authRoutes = require("./src/routes/auth");
const userRoutes = require("./src/routes/user");
const adminRoutes = require("./src/routes/admin");
const sharedRoutes = require("./src/routes/shared");

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

app.use("/auth", authRoutes);
app.use("/", userRoutes);
app.use("/admin", adminRoutes);
app.use("/shared", sharedRoutes);

DBConnection();

module.exports = app;
