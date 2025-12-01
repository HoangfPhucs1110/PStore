const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); // Dùng để tạo token ngẫu nhiên
const sendEmail = require("../utils/sendEmail"); // Hàm gửi mail đã có sẵn

const SECRET_KEY = process.env.JWT_SECRET || "pstore_super_secret_123";

const generateToken = (id) => {
  return jwt.sign({ id }, SECRET_KEY, { expiresIn: "30d" });
};

// Đăng ký
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email đã tồn tại" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });

    res.status(201).json({ 
        token: generateToken(user._id), 
        user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Đăng nhập
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      if (!user.isActive) return res.status(403).json({ message: "Tài khoản bị khóa" });
      
      res.json({ 
          token: generateToken(user._id), 
          user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl } 
      });
    } else {
      res.status(401).json({ message: "Email hoặc mật khẩu sai" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMe = async (req, res) => { res.json(req.user); };

// --- QUÊN MẬT KHẨU ---
const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: "Email không tồn tại trong hệ thống" });

    // Tạo token ngẫu nhiên
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Băm token để lưu vào DB (bảo mật)
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Hết hạn sau 10 phút

    await user.save();

    // Tạo link reset (Trỏ về Frontend)
    const resetUrl = `${process.env.CLIENT_URL || "http://localhost:3000"}/reset-password/${resetToken}`;

    const message = `
      <h1>Bạn đã yêu cầu đặt lại mật khẩu</h1>
      <p>Vui lòng click vào đường dẫn bên dưới để đặt mật khẩu mới:</p>
      <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
      <p>Link này sẽ hết hạn sau 10 phút.</p>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: "Yêu cầu đặt lại mật khẩu PStore",
        message,
      });
      res.json({ message: "Email đã được gửi. Vui lòng kiểm tra hộp thư." });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      return res.status(500).json({ message: "Không thể gửi email. Vui lòng thử lại." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- ĐẶT LẠI MẬT KHẨU ---
const resetPassword = async (req, res) => {
  try {
    // Băm token từ URL để so sánh với DB
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }, // Kiểm tra còn hạn không
    });

    if (!user) return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn" });

    // Đặt lại mật khẩu
    user.passwordHash = await bcrypt.hash(req.body.password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: "Đặt lại mật khẩu thành công! Hãy đăng nhập ngay." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, getMe, forgotPassword, resetPassword };