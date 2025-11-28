const router = require("express").Router();
const Review = require("../models/Review");
const { protect, admin } = require("../middleware/auth");

// List review theo product
router.get("/product/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({
      productId: req.params.productId,
      status: "approved"
    }).populate("userId", "name");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Tạo review
router.post("/", protect, async (req, res) => {
  try {
    const r = await Review.create({
      ...req.body,
      userId: req.user._id,
      status: "pending"
    });
    res.status(201).json(r);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin duyệt
router.put("/:id/status", protect, admin, async (req, res) => {
  try {
    const r = await Review.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(r);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
