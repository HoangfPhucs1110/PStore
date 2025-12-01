const Coupon = require("../models/Coupon");

// 1. Tạo mã giảm giá (Admin)
const createCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const exists = await Coupon.findOne({ code });
    if (exists) return res.status(400).json({ message: "Mã giảm giá này đã tồn tại!" });

    const coupon = await Coupon.create(req.body);
    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Lấy danh sách mã (Admin)
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Cập nhật mã (Admin)
const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Xóa mã (Admin)
const deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa mã giảm giá" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. Áp dụng mã (User nhập ở giỏ hàng)
const applyCoupon = async (req, res) => {
  try {
    const { code, orderTotal } = req.body;
    
    // Tìm mã
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    
    if (!coupon) {
        return res.status(404).json({ message: "Mã giảm giá không tồn tại hoặc đã bị khóa." });
    }

    // Kiểm tra hạn sử dụng
    const now = new Date();
    if (coupon.startDate && new Date(coupon.startDate) > now) {
        return res.status(400).json({ message: "Mã giảm giá chưa đến đợt áp dụng." });
    }
    if (coupon.endDate && new Date(coupon.endDate) < now) {
        return res.status(400).json({ message: "Mã giảm giá đã hết hạn." });
    }

    // Kiểm tra số lượng
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
        return res.status(400).json({ message: "Mã giảm giá đã hết lượt sử dụng." });
    }

    // Kiểm tra giá trị đơn hàng tối thiểu
    if (orderTotal < coupon.minOrder) {
        return res.status(400).json({ message: `Đơn hàng phải từ ${coupon.minOrder.toLocaleString()}đ để dùng mã này.` });
    }

    // Tính toán số tiền giảm
    let discountAmount = 0;
    if (coupon.type === "percent") {
        discountAmount = (orderTotal * coupon.value) / 100;
        // Kiểm tra giảm tối đa
        if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
            discountAmount = coupon.maxDiscount;
        }
    } else if (coupon.type === "fixed") {
        discountAmount = coupon.value;
    }

    // Đảm bảo không giảm quá giá trị đơn hàng
    if (discountAmount > orderTotal) discountAmount = orderTotal;

    res.json({
        couponCode: coupon.code,
        discountAmount: Math.round(discountAmount),
        message: "Áp dụng mã giảm giá thành công!"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createCoupon, getAllCoupons, updateCoupon, deleteCoupon, applyCoupon };