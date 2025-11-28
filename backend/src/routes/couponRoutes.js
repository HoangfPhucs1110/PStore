const router = require("express").Router();
const Coupon = require("../models/Coupon");
const { protect, admin } = require("../middleware/auth");

// Client: áp mã
router.post("/apply", protect, async (req, res) => {
  try {
    const { code, subtotal, categorySlugs } = req.body;
    const now = new Date();
    const coupon = await Coupon.findOne({
      code,
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    });

    if (!coupon) return res.status(400).json({ message: "Mã không hợp lệ" });
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit)
      return res.status(400).json({ message: "Mã đã hết lượt dùng" });
    if (subtotal < (coupon.minOrder || 0))
      return res.status(400).json({ message: "Không đủ điều kiện đơn tối thiểu" });

    // check category nếu có
    if (coupon.applicableCategories?.length && categorySlugs?.length) {
      const ok = categorySlugs.some((c) =>
        coupon.applicableCategories.includes(c)
      );
      if (!ok)
        return res.status(400).json({ message: "Mã không áp dụng cho nhóm hàng này" });
    }

    let discount = 0;
    if (coupon.type === "percent") {
      discount = (subtotal * coupon.value) / 100;
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    } else {
      discount = coupon.value;
    }

    res.json({ discount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: CRUD đơn giản
router.post("/", protect, admin, async (req, res) => {
  const c = await Coupon.create(req.body);
  res.status(201).json(c);
});

router.get("/", protect, admin, async (req, res) => {
  const list = await Coupon.find().sort({ createdAt: -1 });
  res.json(list);
});

module.exports = router;
