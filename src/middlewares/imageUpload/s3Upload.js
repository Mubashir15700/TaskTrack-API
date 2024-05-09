const { S3Client, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const multer = require("multer");
const multerS3 = require("multer-s3");

const s3 = new S3Client({
  credentials: {
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    accessKeyId: process.env.ACCESS_KEY,
  },
  region: process.env.REGION
});

// to get private image
const getPresignedUrl = async (key) => {
  const command = new GetObjectCommand({ Bucket: process.env.BUCKET_NAME, Key: key });
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 }); // URL expires in 1 hour
  return url;
};

// to delete private image
const deleteImage = async (key) => {
  const command = new DeleteObjectCommand({ Bucket: process.env.BUCKET_NAME, Key: key, });
  return await s3.send(command);
};

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname })
    },
    key: function (req, file, cb) {
      cb(null, "Banners/" + Date.now().toString() + "-" + file.originalname);
    }
  }),
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  }
});

const uploadImage = upload;

module.exports = { uploadImage, getPresignedUrl, deleteImage };
