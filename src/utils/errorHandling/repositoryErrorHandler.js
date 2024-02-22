const handleRepositoryError = (errorMessage) => {
    console.error("handleRepositoryError: ", errorMessage);
    throw new Error(errorMessage);
};

module.exports = handleRepositoryError;
