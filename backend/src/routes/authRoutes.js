const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

const buildUserResponse = (u) => ({
  _id: u._id,
  name: u.name,
  email: u.email,
  role: u.role,
  phone: u.phone,
  gender: u.gender,
  avatarUrl: u.avatarUrl,
  addresses: u.addresses || [],
  isActive: u.isActive
});

// Đăng ký
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.json({ token, user: buildUserResponse(user) });
  } catch (err) {
    console.error("POST /auth/register", err);
    res.status(500).json({ message: err.message });
  }
});

// Đăng nhập
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok)
      return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.json({ token, user: buildUserResponse(user) });
  } catch (err) {
    console.error("POST /auth/login", err);
    res.status(500).json({ message: err.message });
  }
});

// Lấy info hiện tại (dùng cho AuthContext)
router.get("/me", protect, async (req, res) => {
  res.json(buildUserResponse(req.user));
});

// Lấy profile chi tiết
router.get("/profile", protect, async (req, res) => {
  res.json(buildUserResponse(req.user));
});

// Cập nhật profile + địa chỉ
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, phone, gender, avatarUrl, addresses } = req.body;
    const user = req.user;

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (gender !== undefined) user.gender = gender;
    if (avatarUrl) user.avatarUrl = avatarUrl;

    if (Array.isArray(addresses)) {
      let defaultSeen = false;
      user.addresses = addresses.map((a) => {
        const addr = {
          label: a.label || "Nhà riêng",
          fullName: a.fullName || name || user.name,
          phone: a.phone || phone || user.phone,
          address: a.address || "",
          isDefault: !!a.isDefault
        };
        if (addr.isDefault) {
          if (defaultSeen) addr.isDefault = false;
          defaultSeen = true;
        }
        return addr;
      });
    }

    await user.save();
    res.json(buildUserResponse(user));
  } catch (err) {
    console.error("PUT /auth/profile", err);
    res.status(500).json({ message: err.message });
  }
});

// Upload avatar
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

      const user = req.user;
      user.avatarUrl = url;
      await user.save();

      res.json({ avatarUrl: url });
    } catch (err) {
      console.error("POST /auth/profile/avatar", err);
      res.status(500).json({ message: err.message });
    }
  }
);

// Đổi mật khẩu
router.put("/change-password", protect, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    const ok = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!ok) return res.status(400).json({ message: "Sai mật khẩu cũ" });

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Đổi mật khẩu thành công" });
  } catch (err) {
    console.error("PUT /auth/change-password", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
