const setCookie = (res, cookieName, token, options = {}) => {
    const defaultOptions = {
        maxAge: 60000 * 60 * 24 * 7, 
        httpOnly: true,
    };

    const mergedOptions = { ...defaultOptions, ...options };

    res.cookie(cookieName, token, mergedOptions);
};

module.exports = setCookie;
