const Cart = require("../models/Cart");
const Product = require("../models/Product");

const getCart = async (req, res) => {
  const userId = req.user?._id;
  const sessionId = req.headers["x-session-id"];
  const cart = await Cart.findOne(userId ? { userId } : { sessionId });
  res.json(cart || { items: [] });
};

const syncCart = async (req, res) => {
  const userId = req.user?._id;
  const sessionId = req.headers["x-session-id"];
  const { items } = req.body;

  // Lấy lại info mới nhất từ DB sản phẩm
  const detailedItems = [];
  for (const it of items) {
    const p = await Product.findById(it.productId);
    if (p) {
      detailedItems.push({
        productId: p._id,
        nameSnapshot: p.name, // Vẫn lưu snapshot để hiển thị nhanh
        priceSnapshot: p.price,
        imageSnapshot: p.thumbnail || p.images?.[0],
        qty: it.qty,
        slug: p.slug
      });
    }
  }
  
  const filter = userId ? { userId } : { sessionId };
  const cart = await Cart.findOneAndUpdate(filter, { userId, sessionId, items: detailedItems }, { upsert: true, new: true });
  res.json(cart);
};

module.exports = { getCart, syncCart };