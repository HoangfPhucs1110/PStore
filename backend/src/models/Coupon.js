const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true, required: true },
    type: { type: String, enum: ["percent", "fixed"], required: true },
    value: { type: Number, required: true },
    minOrder: { type: Number, default: 0 },
    maxDiscount: Number,
    startDate: Date,
    endDate: Date,
    usageLimit: Number,
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    applicableCategories: [String], // slug
    applicableUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model("Coupon", couponSchema);
