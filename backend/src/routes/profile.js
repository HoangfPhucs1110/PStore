const router = require("express").Router();
const User = require("../models/User");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

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

// PUT /api/auth/profile  – lưu tên, sdt, avatarUrl, địa chỉ
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, phone, avatarUrl, addresses } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    if (typeof name === "string") user.name = name;
    if (typeof phone === "string") user.phone = phone;
    if (typeof avatarUrl === "string") user.avatarUrl = avatarUrl;

    if (Array.isArray(addresses)) {
      user.addresses = addresses.map((a) => ({
        label: a.label || "Nhà riêng",
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

// POST /api/auth/profile/avatar – upload ảnh đại diện
router.post(
  "/profile/avatar",
  protect,
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Không nhận được file" });
      }

      const base =
        process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
      const url = `${base}/uploads/${req.file.filename}`;

      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

      user.avatarUrl = url;
      await user.save();

      res.json({ avatarUrl: url });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
