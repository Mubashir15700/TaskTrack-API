const mongoose = require('mongoose');

const Connection = async () => {
    try {
        const URL = process.env.DB_LOCAL_URL;
        mongoose.set('strictQuery', false);
        await mongoose.connect(URL);
        console.log("Connected to database succesfully.");
    } catch (error) {
        console.log(error);
    }
};

module.exports = Connection;