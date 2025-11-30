const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    label: String,
    fullName: String,
    phone: String,
    address: String,
    isDefault: { type: Boolean, default: false }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    phone: String,
    gender: { type: String, enum: ["male", "female"], default: "male" },
    avatarUrl: String,
    addresses: [addressSchema],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

module.exports = mongoose.model("User", userSchema);
