const express = require("express");
const User = require("../models/User");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();

// danh sách user
router.get("/", protect, admin, async (req, res) => {
  const users = await User.find().select("-passwordHash");
  res.json(users);
});

// cập nhật role / khóa mở user
router.patch("/:id", protect, admin, async (req, res) => {
  const { role, isActive } = req.body;

  const fields = {};
  if (role) fields.role = role;
  if (typeof isActive === "boolean") fields.isActive = isActive;

  const user = await User.findByIdAndUpdate(req.params.id, fields, {
    new: true
  }).select("-passwordHash");

  res.json(user);
});

module.exports = router;
