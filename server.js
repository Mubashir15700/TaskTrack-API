const app = require('./app');

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
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
