const router = require("express").Router();
const User = require("../models/User");
const { protect } = require("../middleware/auth");

// GET /api/auth/profile
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/auth/profile
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, phone, avatarUrl, addresses } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;

    if (Array.isArray(addresses)) {
      user.addresses = addresses.map((a) => ({
        label: a.label || "",
        fullName: a.fullName || "",
        phone: a.phone || "",
        address: a.address || "",
        isDefault: !!a.isDefault
      }));
    }

    await user.save();
    const result = await User.findById(user._id).select("-passwordHash");
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
