const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
require("dotenv").config();

// 1. Cấu hình Cloudinary (Lấy từ .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Cấu hình Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "pstore_uploads", // Tên thư mục trên Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    resource_type: "auto", // Tự động nhận diện ảnh/video
  },
});

const upload = multer({ storage: storage });

module.exports = upload;