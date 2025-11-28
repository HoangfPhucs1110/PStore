const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
    productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }]
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

module.exports = mongoose.model("Wishlist", wishlistSchema);
