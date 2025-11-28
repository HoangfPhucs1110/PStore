const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const router = express.Router();

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });
  try {
    const decoded = require("jsonwebtoken").verify(
      token,
      process.env.JWT_SECRET
    );
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const admin = async (req, res, next) => {
  const u = await User.findById(req.userId);
  if (!u || u.role !== "admin")
    return res.status(403).json({ message: "No permission" });
  next();
};

// tạo đơn: trừ tồn kho
router.post("/", auth, async (req, res) => {
  const { items, subtotal, shippingFee, discount, total, shippingInfo } =
    req.body;

  const session = await Order.startSession();
  session.startTransaction();
  try {
    for (const it of items) {
      await Product.updateOne(
        { _id: it.productId, stock: { $gte: it.qty } },
        { $inc: { stock: -it.qty, soldCount: it.qty } }
      ).session(session);
    }

    const order = await Order.create(
      [
        {
          userId: req.userId,
          items,
          subtotal,
          shippingFee,
          discount,
          total,
          shippingInfo
        }
      ],
      { session }
    );

    await session.commitTransaction();
    res.json(order[0]);
  } catch (e) {
    await session.abortTransaction();
    res.status(400).json({ message: "Tạo đơn thất bại", error: e.message });
  } finally {
    session.endSession();
  }
});

router.get("/my", auth, async (req, res) => {
  const orders = await Order.find({ userId: req.userId }).sort({
    createdAt: -1
  });
  res.json(orders);
});

router.get("/", auth, admin, async (req, res) => {
  const orders = await Order.find()
    .populate("userId", "name email")
    .sort({ createdAt: -1 });
  res.json(orders);
});

router.put("/:id/status", auth, admin, async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Not found" });

  const oldStatus = order.status;
  order.status = status;

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
});

module.exports = router;
