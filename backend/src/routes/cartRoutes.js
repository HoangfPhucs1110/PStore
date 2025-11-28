const router = require("express").Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middleware/auth");

// Lấy cart hiện tại (ưu tiên userId, fallback sessionId)
router.get("/", async (req, res) => {
  try {
    const sessionId = req.headers["x-session-id"];
    const userId = req.user?._id;
    const filter = userId ? { userId } : { sessionId };
    const cart = await Cart.findOne(filter);
    res.json(cart || { items: [], totalItem: 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cập nhật cart
router.post("/", async (req, res) => {
  try {
    const sessionId = req.headers["x-session-id"];
    const userId = req.user?._id || null;
    const { items } = req.body;

    // snapshot lại thông tin
    const detailedItems = [];
    for (const it of items) {
      const p = await Product.findById(it.productId);
      if (!p) continue;
      detailedItems.push({
        productId: p._id,
        nameSnapshot: p.name,
        priceSnapshot: p.price,
        imageSnapshot: p.thumbnail || p.images?.[0],
        qty: it.qty
      });
    }

    const totalItem = detailedItems.reduce((s, x) => s + x.qty, 0);

    const filter = userId ? { userId } : { sessionId };
    const cart = await Cart.findOneAndUpdate(
      filter,
      { userId, sessionId, items: detailedItems, totalItem },
      { upsert: true, new: true }
    );
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
