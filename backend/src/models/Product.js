const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    categorySlug: { type: String, required: true },
    brand: String,
    images: [String],
    thumbnail: String,
    price: { type: Number, required: true }, // Giá bán
    importPrice: { type: Number, required: true, default: 0 }, // <--- GIÁ GỐC (MỚI)
    oldPrice: Number,
    stock: { type: Number, default: 0 },
    sku: String,
    shortDescription: String,
    description: String,
    status: {
      type: String,
      enum: ["active", "hidden", "out-of-stock"],
      default: "active"
    },
    specs: { type: mongoose.Schema.Types.Mixed },
    tags: [String],
    isFeatured: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
    soldCount: { type: Number, default: 0 },
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 }
  },
  { 
    timestamps: true,
    suppressReservedKeysWarning: true
  }
);

module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);