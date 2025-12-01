const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Key bảo mật
const SECRET_KEY = process.env.JWT_SECRET || "pstore_super_secret_123";

const verifyToken = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization || req.headers.token;

  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, SECRET_KEY);
      req.user = await User.findById(decoded.id).select("-passwordHash");
      if (!req.user) return res.status(401).json({ message: "User không tồn tại" });
      next();
    } catch (error) {
      return res.status(401).json({ message: "Token không hợp lệ" });
    }
  } else {
    return res.status(401).json({ message: "Không có token" });
  }
};

// Middleware cho phép khách vãng lai (không bắt buộc token)
const verifyTokenOptional = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization || req.headers.token;

  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, SECRET_KEY);
      req.user = await User.findById(decoded.id).select("-passwordHash");
    } catch (error) {
      req.user = null;
    }
  } else {
    req.user = null;
  }
  next();
};

// --- CẬP NHẬT Ở ĐÂY: Cho phép cả Admin và Staff ---
const admin = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "staff" || req.user.isAdmin)) {
    next();
  } else {
    res.status(403).json({ message: "Cần quyền Admin hoặc Nhân viên" });
  }
};

const verifyChatAccess = (req, res, next) => {
    if (req.user && (req.user.role === "admin" || req.user.role === "staff" || req.user.isAdmin)) {
        next();
    } else {
        res.status(403).json({ message: "Không có quyền truy cập chat" });
    }
};

module.exports = { 
    verifyToken, 
    verifyTokenOptional, 
    protect: verifyToken, 
    admin, 
    verifyChatAccess 
};