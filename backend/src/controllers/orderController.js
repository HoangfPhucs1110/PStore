const Order = require("../models/Order");
const Product = require("../models/Product");

const createOrder = async (req, res) => {
  try {
    const { items, address, contact, note } = req.body;
    if (!items?.length) return res.status(400).json({ message: "Giỏ hàng trống" });

    let itemsPrice = 0;
    const orderItems = items.map(item => {
        itemsPrice += item.priceSnapshot * item.qty;
        return { ...item, priceSnapshot: Number(item.priceSnapshot), qty: Number(item.qty) };
    });

    const shippingPrice = itemsPrice >= 1000000 ? 0 : 30000;
    const total = itemsPrice + shippingPrice;

    const order = await Order.create({
      userId: req.user._id,
      items: orderItems,
      shippingInfo: { ...address, ...contact, note },
      itemsPrice, shippingPrice, total,
      code: Math.random().toString(36).substr(2, 9).toUpperCase()
    });

    // Trừ kho
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.qty, soldCount: item.qty } });
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find().populate("userId", "name email").sort({ createdAt: -1 });
  res.json(orders);
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn" });

    // Hoàn kho nếu hủy
    if (status === "canceled" && order.status !== "canceled") {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, { $inc: { stock: item.qty, soldCount: -item.qty } });
      }
    }
    order.status = status;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteOrder = async (req, res) => {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa đơn" });
}

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus, deleteOrder };