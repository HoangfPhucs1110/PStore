const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: {
      type: String,
      unique: true,
      enum: [
        "laptop",
        "man-hinh",
        "ban-phim",
        "loa",
        "chuot",
        "tai-nghe",
        "ghe-gaming",
        "tay-cam"
      ],
      required: true
    },
    icon: String,
    description: String,
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports =
  mongoose.models.Category || mongoose.model("Category", categorySchema);
