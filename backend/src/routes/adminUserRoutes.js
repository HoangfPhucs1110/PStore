const express = require("express");
const User = require("../models/User");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();

// GET /api/admin/users
router.get("/", protect, admin, async (req, res) => {
  const users = await User.find().select("-passwordHash").sort({ createdAt: -1 });
  res.json(users);
});

// PATCH /api/admin/users/:id  (đổi quyền / khóa mở)
router.patch("/:id", protect, admin, async (req, res) => {
  const { role, isActive } = req.body;

  const updates = {};
  if (role) updates.role = role;
  if (typeof isActive === "boolean") updates.isActive = isActive;

  const user = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true
  }).select("-passwordHash");

  if (!user) return res.status(404).json({ message: "Không tìm thấy user" });
  res.json(user);
});

// DELETE /api/admin/users/:id
router.delete("/:id", protect, admin, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "Không tìm thấy user" });
  if (user.role === "admin") {
    return res
      .status(400)
      .json({ message: "Không thể xoá tài khoản quản trị." });
  }
  await user.deleteOne();
  res.json({ success: true });
});

module.exports = router;
