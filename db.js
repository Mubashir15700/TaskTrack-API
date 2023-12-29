const mongoose = require('mongoose');
const logger = require('./src/utils/logger');

const DBConnection = async () => {
    try {
        const URL = process.env.DB_LOCAL_URL;
        mongoose.set('strictQuery', false);

        mongoose.connection.on('connected', () => {
            logger.info('Connected to MongoDB');
        });

        mongoose.connection.on('error', (err) => {
            logger.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            logger.info('MongoDB disconnected');
        });

        await mongoose.connect(URL);

        logger.info('Connected to the database successfully.');
    } catch (error) {
        logger.error('Error connecting to the database:', error);
    }
};

module.exports = DBConnection;
