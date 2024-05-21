const logger = require("../utils/errorHandling/logger");

const checkEnvVariables = () => {
    const requiredEnvVariables = [
        "PORT",
        "DB_URL",
        "CORS_ORIGIN",
        "SESSION_SECRET_KEY",
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
        "APP_EMAIL",
        "APP_PASSWORD"
    ];

    const missingVariables = requiredEnvVariables.filter(variable => !process.env[variable]);

    if (missingVariables.length > 0) {
        logger.error(`Missing environment variables: ${missingVariables.join(", ")}`);
        process.exit(1);
    }
};

module.exports = checkEnvVariables;
