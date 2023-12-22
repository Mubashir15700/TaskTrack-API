require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const Connection = require('./database/database');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true
}));

app.use("/", userRoutes);
app.use("/admin", adminRoutes);

Connection();

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), () => {
    console.log(`Server running on port ${app.get('port')}`);
});

process.on('SIGINT', async () => {
    console.log('Server shutting down...');
    await mongoose.connection.close();

    server.close((err) => {
        if (err) {
            console.error('Error closing the server:', err);
            process.exit(1); // Exit with error code
        }

        console.log('Server shut down gracefully.');
        process.exit(0); // Exit with success code
    });
});
