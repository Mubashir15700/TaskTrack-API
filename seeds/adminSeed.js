require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("../src/models/admin");
const dbConnection = require("../src/config/db");
const logger = require("../src/utils/errorHandling/logger");

const seedAdmin = async () => {
    try {
        // Establish database connection
        await dbConnection();

        // Check if there are any existing admins
        const existingAdmin = await Admin.findOne({ username: process.env.ADMINUSERNAME });

        if (!existingAdmin) {
            const username = process.env.ADMINUSERNAME;
            const password = process.env.ADMINPASSWORD;

            if (!username || !password) {
                logger.error("Username and password are required.");
                return;
            }

            const hashedPassword = await bcrypt.hash(password, salt);

            // Create a new admin document
            const admin = new Admin({
                username,
                password: hashedPassword,
            });

            // Save the admin to the database
            await admin.save();

            logger.info("Created admin successfully.");
        } else {
            logger.info("Admin already exists. Skipping seed.");
        }
    } catch (error) {
        logger.error("Error seeding admin:", error);
    }

    await mongoose.connection.close();
};

seedAdmin();
