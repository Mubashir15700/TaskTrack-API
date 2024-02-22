function serverErrorHandler(message) {
    console.log("serverErrorHandler: ", message);
    return {
        status: message ? 400 : 500,
        message: message ?? "Internal Server Error"
    };
};

module.exports = serverErrorHandler;
