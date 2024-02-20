const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

// Configure AWS SDK
aws.config.update({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION
});

const s3 = new aws.S3();

// Multer-S3 storage configuration
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME,
    acl: "public-read", // Change ACL as needed
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + "-" + file.originalname);
    }
  })
});

// Middleware function to handle file upload
const uploadImageToS3 = upload.single("profile");

module.exports = uploadImageToS3;
