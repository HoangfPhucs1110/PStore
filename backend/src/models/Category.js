const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    icon: { type: String, default: "" }, // Thêm default để tránh lỗi null
    description: String,
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Kiểm tra xem model đã tồn tại chưa để tránh lỗi biên dịch lại
module.exports = mongoose.models.Category || mongoose.model("Category", categorySchema);