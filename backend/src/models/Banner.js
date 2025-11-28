const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    title: String,
    subTitle: String,
    image: String,
    link: String,
    position: {
      type: String,
      enum: [
        "hero",
        "mini-left",
        "mini-right",
        "promo-double-left",
        "promo-double-right"
      ]
    },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model("Banner", bannerSchema);
