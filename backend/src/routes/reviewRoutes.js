// backend/src/routes/reviewRoutes.js
const express = require("express");
const Review = require("../models/Review");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();

// ---- HÀM TÍNH LẠI ĐIỂM ----
async function recalcProductRating(productId) {
  const stats = await Review.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "$product",
        count: { $sum: 1 },
        avg: { $avg: "$rating" }
      }
    }
  ]);

  const info = stats[0];
  await Product.findByIdAndUpdate(productId, {
    ratingCount: info ? info.count : 0,
    ratingAvg: info ? info.avg : 0
  });
}

// ---- USER XEM REVIEW CỦA 1 SẢN PHẨM ----
router.get("/products/:productId/reviews", async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("user", "name email avatar avatarUrl photo image")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi tải đánh giá" });
  }
});

// ---- USER TẠO / CẬP NHẬT REVIEW ----
router.post("/reviews", protect, async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    if (!productId || !rating) {
      return res.status(400).json({ message: "Thiếu dữ liệu" });
    }

    const data = {
      product: productId,
      user: req.user._id,
      rating,
      comment
    };

    const existing = await Review.findOne({
      product: productId,
      user: req.user._id
    });

    let review;
    if (existing) {
      existing.rating = rating;
      existing.comment = comment;
      review = await existing.save();
    } else {
      review = await Review.create(data);
    }

    await recalcProductRating(productId);

    const populated = await review.populate(
      "user",
      "name email avatar avatarUrl photo image"
    );
    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Không lưu được đánh giá" });
  }
});

// ---- USER / ADMIN XÓA REVIEW ----
router.delete("/reviews/:id", protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Không tìm thấy" });

    const isOwner = review.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Không có quyền" });
    }

    await review.deleteOne();
    await recalcProductRating(review.product);

    res.json({ message: "Đã xóa" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Không xóa được đánh giá" });
  }
});

// ---- ADMIN: LẤY TẤT CẢ REVIEW ----
router.get("/admin/reviews", protect, admin, async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name email avatar avatarUrl photo image")
      .populate("product", "name slug")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi tải danh sách đánh giá" });
  }
});

// ---- ADMIN: XÓA REVIEW (TOÀN QUYỀN) ----
router.delete("/admin/reviews/:id", protect, admin, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Không tìm thấy" });

    await review.deleteOne();
    await recalcProductRating(review.product);

    res.json({ message: "Đã xóa đánh giá" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Không xóa được đánh giá" });
  }
});

module.exports = router;
