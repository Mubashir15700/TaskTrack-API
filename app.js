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
    "GOOGLE_CLIENT_SECRET",
    "JWT_SECRET_KEY",
    "OPENCAGE_API_KEY",
    "STRIPE_PUBLIC_KEY",
    "STRIPE_SECRET_KEY",
    "WEBHOOK_SECRET",
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
const session = require("express-session");

// DB Connection
const DBConnection = require("./src/config/db");
// Passport
const passport = require("./src/config/passport");
// Routes
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
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(session({
    secret: "session secret",
    resave: false,
    saveUninitialized: true
}));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use((err, req, res, next) => {
    logger.error("Something went wrong!: ", err.stack);
    res.status(500).json({
        status: "failed",
        message: "Something went wrong!"
    });
});

// passport setup
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/shared", sharedRoutes);
app.use("/", userRoutes);

// Serve static files for the React page
app.use(express.static(path.join(__dirname, "../client", "dist")));

// If a route doesn"t match any of the above, serve the React index.html
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
});

DBConnection();

module.exports = app;
