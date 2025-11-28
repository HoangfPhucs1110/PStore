const router = require("express").Router();
const Product = require("../models/Product");
const Category = require("../models/Category");
const { protect, admin } = require("../middleware/auth");
const upload = require("../middleware/upload");

// List + filter
router.get("/", async (req, res) => {
  try {
    const { keyword, categorySlug, brand, tag, isFeatured, isNew } = req.query;
    const filter = { status: "active" };

    if (keyword)
      filter.name = { $regex: keyword, $options: "i" };
    if (categorySlug)
      filter.categorySlug = categorySlug;
    if (brand)
      filter.brand = { $regex: brand, $options: "i" };
    if (tag)
      filter.tags = tag;
    if (isFeatured === "true")
      filter.isFeatured = true;
    if (isNew === "true")
      filter.isNew = true;

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Detail theo slug
router.get("/slug/:slug", async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ message: "Không tìm thấy" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Detail theo id (cho admin / cart)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Không tìm thấy" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADMIN: tạo sản phẩm
router.post("/", protect, admin, async (req, res) => {
  try {
    const p = await Product.create(req.body);
    res.status(201).json(p);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADMIN: cập nhật
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const p = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!p) return res.status(404).json({ message: "Không tìm thấy" });
    res.json(p);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADMIN: xóa
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const p = await Product.findByIdAndDelete(req.params.id);
    if (!p) return res.status(404).json({ message: "Không tìm thấy" });
    res.json({ message: "Đã xóa sản phẩm" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Categories: list
router.get("/_meta/categories/all", async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({
      sortOrder: 1
    });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/upload-image", upload.single("image"), (req, res) => {
  res.json({ url: `/uploads/${req.file.filename}` });
});

module.exports = router;
