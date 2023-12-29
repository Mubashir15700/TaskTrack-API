const sendResponse = (res, result) => {
    const { status, message, data } = result;
    const jsonResponse = { status: status === 201 ? 'success' : 'failed', message };

    if (data) {
        Object.keys(data).forEach((key) => {
            jsonResponse[key] = data[key];
        });
    }

    res.status(status).json(jsonResponse);
};

module.exports = sendResponse;
