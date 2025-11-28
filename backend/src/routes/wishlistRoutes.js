const router = require("express").Router();
const Wishlist = require("../models/Wishlist");
const { protect } = require("../middleware/auth");

// Lấy wishlist của tôi
router.get("/", protect, async (req, res) => {
  const wl = await Wishlist.findOne({ userId: req.user._id });
  res.json(wl || { productIds: [] });
});

// Toggle sản phẩm
router.post("/toggle", protect, async (req, res) => {
  const { productId } = req.body;
  let wl = await Wishlist.findOne({ userId: req.user._id });
  if (!wl) wl = await Wishlist.create({ userId: req.user._id, productIds: [] });

  const idx = wl.productIds.findIndex((id) => id.equals(productId));
  if (idx >= 0) wl.productIds.splice(idx, 1);
  else wl.productIds.push(productId);

  await wl.save();
  res.json(wl);
});

module.exports = router;
