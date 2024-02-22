const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Function to get the destination folder based on the type
const getDestination = (type) => {
    return path.join(__dirname, `../../uploads/${type}/`);
};

// Ensure the destination directory exists
const createDestinationIfNotExists = (type) => {
    const uploadDirectory = getDestination(type);
    if (!fs.existsSync(uploadDirectory)) {
        fs.mkdirSync(uploadDirectory, { recursive: true });
    }
};

// Define allowed file types
const imageFilter = (req, file, cb) => {
    if (!req.files) {
        // Do nothing and proceed to the next middleware
        return cb(null, true);
    }
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
};

// Define storage settings
const storage = (type) => multer.diskStorage({
    destination: function (req, file, cb) {
        createDestinationIfNotExists(type);
        cb(null, getDestination(type));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

// Configure multer with the defined settings
const upload = (type) => multer({
    storage: storage(type),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB in bytes
    },
    fileFilter: imageFilter,
});

module.exports = upload;
