const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Bảo vệ route – yêu cầu đăng nhập
const protect = async (req, res, next) => {
  let token = null;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Bạn chưa đăng nhập hoặc token không tồn tại." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "Tài khoản không tồn tại hoặc đã bị khóa." });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error("auth protect error:", err);
    return res
      .status(401)
      .json({ message: "Token không hợp lệ hoặc đã hết hạn." });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") return next();
  return res
    .status(403)
    .json({ message: "Chỉ quản trị viên mới được phép thực hiện." });
};

module.exports = { protect, admin };
