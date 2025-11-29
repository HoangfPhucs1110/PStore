const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();

// TẠO ĐƠN HÀNG (CHECKOUT)
router.post("/", protect, async (req, res) => {
  const { items, address, contact, note } = req.body;

  if (!Array.isArray(items) || !items.length) {
    return res.status(400).json({ message: "Giỏ hàng trống." });
  }

  try {
    const safeItems = items.map((it) => ({
      productId: it.productId,
      nameSnapshot: it.nameSnapshot,
      imageSnapshot: it.imageSnapshot,
      priceSnapshot: Number(it.priceSnapshot || 0),
      qty: Number(it.qty || 1)
    }));

    // tiền hàng
    const itemsPrice = safeItems.reduce(
      (sum, it) => sum + it.priceSnapshot * it.qty,
      0
    );

    // free ship nếu > 1tr
    const shippingPrice = itemsPrice >= 1000000 ? 0 : 30000;
    const discount = 0;
    const total = itemsPrice + shippingPrice - discount;

    const shippingInfo = {
      fullName: address?.fullName || contact?.name || "",
      phone: address?.phone || contact?.phone || "",
      address: address?.address || "",
      note: note || ""
    };

    const code = Math.random().toString(16).slice(2, 8); // mã ngắn

    const order = await Order.create({
      userId: req.user._id,
      items: safeItems,
      itemsPrice,
      shippingPrice,
      discount,
      total,
      code,
      paymentMethod: "COD",
      paymentStatus: "unpaid",
      status: "pending",
      shippingInfo
    });

    // trừ tồn kho
    for (const it of safeItems) {
      if (!it.productId || !it.qty) continue;
      await Product.updateOne(
        { _id: it.productId },
        { $inc: { stock: -it.qty, soldCount: it.qty } }
      );
    }

    res.status(201).json(order);
  } catch (e) {
    console.error("POST /orders", e);
    res
      .status(500)
      .json({ message: "Tạo đơn thất bại", error: e.message });
  }
});

// ĐƠN CỦA CHÍNH USER
router.get("/my", protect, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({
      createdAt: -1
    });
    res.json(orders);
  } catch (e) {
    console.error("GET /orders/my", e);
    res.status(500).json({ message: e.message });
  }
});

// ADMIN: LẤY TẤT CẢ ĐƠN
router.get("/", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email");
    res.json(orders);
  } catch (e) {
    console.error("GET /orders", e);
    res.status(500).json({ message: e.message });
  }
});

// ADMIN: CẬP NHẬT TRẠNG THÁI
router.put("/:id/status", protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["pending", "shipping", "completed", "canceled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ." });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
    }

    const oldStatus = order.status;
    order.status = status;

    // nếu chuyển sang hủy thì trả lại tồn kho
    if (oldStatus !== "canceled" && status === "canceled") {
      for (const it of order.items) {
        await Product.updateOne(
          { _id: it.productId },
          { $inc: { stock: it.qty, soldCount: -it.qty } }
        );
      }
    }

    await order.save();
    res.json(order);
  } catch (e) {
    console.error("PUT /orders/:id/status", e);
    res.status(500).json({ message: e.message });
  }
});

// ADMIN: XOÁ ĐƠN
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn." });

    await order.deleteOne();
    res.json({ success: true });
  } catch (e) {
    console.error("DELETE /orders/:id", e);
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
