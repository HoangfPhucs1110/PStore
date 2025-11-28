const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    nameSnapshot: String,
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
    subtotal: Number,
    shippingFee: Number,
    discount: Number,
    total: Number,
    status: {
      type: String,
      enum: ["pending", "shipping", "completed", "canceled"],
      default: "pending"
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "VNPAY", "MOMO", "BANK"],
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

module.exports =
  mongoose.models.Order || mongoose.model("Order", orderSchema);
