const express = require("express");
const router = express.Router();
const { getAllProducts, getProductBySlug, getProductById, createProduct, updateProduct, deleteProduct, uploadImage } = require("../controllers/productController");
const { protect, admin } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.get("/", getAllProducts);
router.get("/slug/:slug", getProductBySlug);
router.get("/:id", getProductById);

router.post("/", protect, admin, createProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);
router.post("/upload-image", protect, admin, upload.single("image"), uploadImage);

module.exports = router;