const router = require("express").Router();
const Banner = require("../models/Banner");
const { protect, admin } = require("../middleware/auth");

// Client: lấy banner active
router.get("/", async (req, res) => {
  const { position } = req.query;
  const filter = { isActive: true };
  if (position) filter.position = position;
  const banners = await Banner.find(filter).sort({ sortOrder: 1 });
  res.json(banners);
});

// Admin: CRUD đơn giản
router.post("/", protect, admin, async (req, res) => {
  const b = await Banner.create(req.body);
  res.status(201).json(b);
});

router.put("/:id", protect, admin, async (req, res) => {
  const b = await Banner.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  res.json(b);
});

router.delete("/:id", protect, admin, async (req, res) => {
  await Banner.findByIdAndDelete(req.params.id);
  res.json({ message: "Đã xóa banner" });
});

module.exports = router;
