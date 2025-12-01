const express = require("express");
const router = express.Router();
const { getCart, syncCart } = require("../controllers/cartController");
const { protect } = require("../middleware/auth");

// Cho phép cả user chưa login dùng cart (qua sessionId)
router.get("/", async (req, res, next) => {
    // Middleware tùy biến để check token nếu có nhưng không bắt buộc
    if(req.headers.authorization) return protect(req, res, next);
    next();
}, getCart);

router.post("/", async (req, res, next) => {
    if(req.headers.authorization) return protect(req, res, next);
    next();
}, syncCart);

module.exports = router;