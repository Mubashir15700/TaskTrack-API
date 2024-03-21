require("dotenv").config();
const path = require("path");
const checkEnvVariables = require("./src/utils/checkEnvVariables");
const logger = require("./src/utils/errorHandling/logger");

// Check for required environment variables
checkEnvVariables();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
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
    secret: process.env.SESSION_SECRET_KEY,
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

module.exports = app;
