const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    nameSnapshot: String,
    priceSnapshot: Number,
    imageSnapshot: String,
    qty: Number
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    sessionId: { type: String, index: true },
    items: [cartItemSchema],
    totalItem: { type: Number, default: 0 }
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

module.exports = mongoose.model("Cart", cartSchema);
