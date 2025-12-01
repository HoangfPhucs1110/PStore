const express = require("express");
const router = express.Router();
const Banner = require("../models/Banner");
const Category = require("../models/Category");
const Coupon = require("../models/Coupon");
const { subscribe, unsubscribe, getAllSubscribers, deleteSubscriber } = require("../controllers/subscriberController");
const { protect, admin } = require("../middleware/auth");

// --- BANNER ---
router.get("/banners", async (req, res) => {
    const banners = await Banner.find({ isActive: true }).sort("sortOrder");
    res.json(banners);
});
router.post("/banners", protect, admin, async (req, res) => res.json(await Banner.create(req.body)));

// --- CATEGORY ---
router.get("/categories", async (req, res) => {
    const cats = await Category.find({ isActive: true }).sort("sortOrder");
    res.json(cats);
});

// --- COUPON ---
router.post("/coupons/apply", protect, async (req, res) => {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code, isActive: true });
    if(!coupon) return res.status(400).json({message: "Mã không hợp lệ"});
    res.json(coupon);
});

// --- EMAIL MARKETING (SUBSCRIBERS) - PHẦN BẠN ĐANG THIẾU ---
router.post("/subscribers", subscribe);                       // Khách đăng ký
router.post("/subscribers/unsubscribe", unsubscribe);         // Khách hủy đăng ký
router.get("/subscribers", protect, admin, getAllSubscribers); // Admin xem danh sách (Sửa lỗi 404 của bạn)
router.delete("/subscribers/:id", protect, admin, deleteSubscriber); // Admin xóa

module.exports = router;