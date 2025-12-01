const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-passwordHash");
      if (!req.user || req.user.isActive === false) {
        return res.status(401).json({ message: "Tài khoản không tồn tại hoặc bị khóa" });
      }
      next();
    } catch (error) {
      res.status(401).json({ message: "Token không hợp lệ" });
    }
  } else {
    res.status(401).json({ message: "Chưa đăng nhập" });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Yêu cầu quyền Admin" });
  }
};

module.exports = { protect, admin };