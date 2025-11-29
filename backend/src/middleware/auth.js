const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware bảo vệ route, yêu cầu JWT
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
      .json({ message: "Không có token, vui lòng đăng nhập lại." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("_id role");
    if (!user) {
      return res.status(401).json({ message: "Tài khoản không tồn tại." });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("protect middleware error", err);
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
