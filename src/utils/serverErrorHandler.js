function serverErrorHandler(message, error) {
    console.error(message, error);
    return {
        status: 500,
        message: `Internal Server Error: ${error ? error.message : ""}`
    };
};

module.exports = serverErrorHandler;
