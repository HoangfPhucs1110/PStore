const express = require("express");
const router = express.Router();
const { createCoupon, getAllCoupons, updateCoupon, deleteCoupon, applyCoupon } = require("../controllers/couponController");
const { protect, admin } = require("../middleware/auth");

// Public (Cho khách hàng áp mã)
router.post("/apply", applyCoupon);

// Admin (Quản lý)
router.get("/", protect, admin, getAllCoupons);
router.post("/", protect, admin, createCoupon);
router.put("/:id", protect, admin, updateCoupon);
router.delete("/:id", protect, admin, deleteCoupon);

module.exports = router;