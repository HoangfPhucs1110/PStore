const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    nameSnapshot: String,
    imageSnapshot: String,
    priceSnapshot: Number,
    qty: Number
  },
  { _id: false }
);

const shippingInfoSchema = new mongoose.Schema(
  {
    fullName: String,
    phone: String,
    address: String,
    note: String
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [orderItemSchema],
    itemsPrice: Number,
    shippingPrice: Number,
    discount: { type: Number, default: 0 },
    total: Number,
    totalProfit: { type: Number, default: 0 }, // <--- TỔNG LỢI NHUẬN (MỚI)
    
    code: String, 
    orderCode: Number, 

    status: {
      type: String,
      enum: ["pending", "shipping", "completed", "canceled"],
      default: "pending"
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "PAYOS", "BANK"],
      default: "COD"
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid"
    },
    shippingInfo: shippingInfoSchema
  },
  { timestamps: true }
);

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);