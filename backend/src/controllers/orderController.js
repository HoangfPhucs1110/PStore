const Order = require("../models/Order");
const Product = require("../models/Product");
const PayOS = require("@payos/node");
const sendEmail = require("../utils/sendEmail"); //

const PayOSConstructor = PayOS.PayOS || PayOS;
let payos;
try {
    payos = new PayOSConstructor(
        process.env.PAYOS_CLIENT_ID,
        process.env.PAYOS_API_KEY,
        process.env.PAYOS_CHECKSUM_KEY
    );
} catch (err) {}

// --- 1. TẠO MẪU EMAIL HTML ---
const createOrderEmailTemplate = (order) => {
    const itemsHtml = order.items.map(item => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">
                <img src="${item.imageSnapshot}" alt="${item.nameSnapshot}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">
                ${item.nameSnapshot}<br>
                <small>x${item.qty}</small>
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
                ${item.priceSnapshot.toLocaleString('vi-VN')}đ
            </td>
        </tr>
    `).join('');

    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #2563eb; padding: 20px; text-align: center; color: white;">
            <h2 style="margin: 0;">Xác Nhận Đơn Hàng</h2>
            <p style="margin: 5px 0 0;">Mã đơn: <strong>#${order.code}</strong></p>
        </div>
        <div style="padding: 20px;">
            <p>Xin chào <strong>${order.shippingInfo.fullName}</strong>,</p>
            <p>Cảm ơn bạn đã đặt hàng tại PStore. Đơn hàng của bạn đã được tiếp nhận và đang chờ xử lý.</p>
            
            <h3 style="border-bottom: 2px solid #2563eb; padding-bottom: 10px; margin-top: 20px;">Chi tiết đơn hàng</h3>
            <table style="width: 100%; border-collapse: collapse;">
                ${itemsHtml}
            </table>
            
            <div style="margin-top: 20px; text-align: right;">
                <p>Tạm tính: <strong>${order.itemsPrice.toLocaleString('vi-VN')}đ</strong></p>
                <p>Phí ship: <strong>${order.shippingPrice.toLocaleString('vi-VN')}đ</strong></p>
                <p>Giảm giá: <strong>-${order.discount.toLocaleString('vi-VN')}đ</strong></p>
                <h3 style="color: #d32f2f; margin: 10px 0;">Tổng cộng: ${order.total.toLocaleString('vi-VN')}đ</h3>
            </div>

            <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin-top: 20px;">
                <p style="margin: 5px 0;"><strong>Địa chỉ giao hàng:</strong> ${order.shippingInfo.address}</p>
                <p style="margin: 5px 0;"><strong>SĐT:</strong> ${order.shippingInfo.phone}</p>
                <p style="margin: 5px 0;"><strong>Thanh toán:</strong> ${order.paymentMethod === 'PAYOS' ? 'Online qua PayOS' : 'Thanh toán khi nhận hàng (COD)'}</p>
            </div>
            
            <p style="text-align: center; margin-top: 30px; font-size: 12px; color: #666;">
                Đây là email tự động, vui lòng không trả lời.<br>
                Cần hỗ trợ? Liên hệ <a href="mailto:hotro@pstore.vn">hotro@pstore.vn</a>
            </p>
        </div>
    </div>
    `;
};

// --- 2. CẬP NHẬT HÀM TẠO ĐƠN ---
const createOrder = async (req, res) => {
  try {
    const { items, address, contact, note, paymentMethod, paymentStatus, shippingInfo, discount } = req.body;

    if (!items?.length) return res.status(400).json({ message: "Giỏ hàng trống" });

    let itemsPrice = 0;
    let totalProfit = 0;
    const orderItems = [];

    // Tính toán lại giá và lợi nhuận từ DB để bảo mật
    for (const item of items) {
        const product = await Product.findById(item.productId);
        if (product) {
            const qty = Number(item.qty);
            const price = Number(item.priceSnapshot);
            const importPrice = Number(product.importPrice || 0);

            itemsPrice += price * qty;
            const itemProfit = (price - importPrice) * qty;
            totalProfit += itemProfit;

            orderItems.push({
                productId: product._id,
                nameSnapshot: item.nameSnapshot || product.name,
                imageSnapshot: item.imageSnapshot || product.thumbnail,
                priceSnapshot: price,
                qty: qty
            });

            await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -qty, soldCount: qty } });
        }
    }

    const shippingPrice = itemsPrice >= 1000000 ? 0 : 30000;
    const finalDiscount = Number(discount) || 0;
    const total = Math.max(0, itemsPrice + shippingPrice - finalDiscount);
    const finalShippingInfo = shippingInfo || { ...address, ...contact, note };

    const order = await Order.create({
      userId: req.user ? req.user._id : null,
      items: orderItems,
      shippingInfo: finalShippingInfo,
      itemsPrice, shippingPrice, discount: finalDiscount, total, totalProfit,
      paymentMethod: paymentMethod || 'COD',
      paymentStatus: paymentStatus || 'unpaid',
      code: Math.random().toString(36).substr(2, 9).toUpperCase()
    });

    // --- GỬI EMAIL XÁC NHẬN ---
    if (contact && contact.email) {
        try {
            await sendEmail({
                email: contact.email,
                subject: `[PStore] Xác nhận đơn hàng #${order.code}`,
                message: createOrderEmailTemplate(order),
            });
        } catch (emailError) {
            console.error("Gửi email đơn hàng thất bại:", emailError);
        }
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) { res.status(500).json({ message: error.message }); }
};
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("userId", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) { res.status(500).json({ message: error.message }); }
};
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn" });
    if (status === "canceled" && order.status !== "canceled") {
      for (const item of order.items) { await Product.findByIdAndUpdate(item.productId, { $inc: { stock: item.qty, soldCount: -item.qty } }); }
    }
    if (status === "completed") { order.paymentStatus = "paid"; }
    order.status = status;
    await order.save();
    res.json(order);
  } catch (error) { res.status(500).json({ message: error.message }); }
};
const deleteOrder = async (req, res) => {
  try { await Order.findByIdAndDelete(req.params.id); res.json({ message: "Đã xóa đơn" }); } 
  catch (error) { res.status(500).json({ message: error.message }); }
};
const lookupOrder = async (req, res) => {
  try {
    const { phone, orderCode } = req.body;
    if (!phone && !orderCode) return res.status(400).json({ message: "Nhập thông tin tra cứu" });
    let query = {};
    if (phone) query['shippingInfo.phone'] = phone.trim();
    if (orderCode) query.code = { $regex: new RegExp(`^${orderCode.trim()}$`, "i") };
    const orders = await Order.find(query).sort({ createdAt: -1 });
    if (!orders.length) return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
    res.json(orders);
  } catch (error) { res.status(500).json({ message: error.message }); }
};
const createPaymentLink = async (req, res) => {
    try {
        const { orderId, amount } = req.body;
        if (!payos) return res.status(500).json({ message: "Chưa cấu hình PayOS" });
        const orderCode = Number(String(Date.now()).slice(-6) + Math.floor(Math.random() * 1000));
        await Order.findByIdAndUpdate(orderId, { orderCode: orderCode });
        const body = {
            orderCode: orderCode, amount: Math.round(Number(amount)), description: `Thanh toan ${orderCode}`, items: [], 
            returnUrl: `${process.env.CLIENT_URL || "http://localhost:3000"}/payment-result`, 
            cancelUrl: `${process.env.CLIENT_URL || "http://localhost:3000"}/payment-result` 
        };
        const paymentLinkRes = await payos.paymentRequests.create(body);
        res.json({ paymentUrl: paymentLinkRes.checkoutUrl });
    } catch (error) { res.status(500).json({ message: "Lỗi tạo link PayOS" }); }
};
const getPaymentInfo = async (req, res) => {
    try {
        const { orderCode } = req.body;
        const paymentLinkInfo = await payos.paymentRequests.get(orderCode);
        if (paymentLinkInfo && paymentLinkInfo.status === "PAID") {
            await Order.findOneAndUpdate({ orderCode: orderCode }, { paymentStatus: "paid", paymentMethod: "PAYOS" });
            res.json({ code: "00", data: paymentLinkInfo });
        } else {
            await Order.findOneAndDelete({ orderCode: orderCode });
            res.json({ code: "01", message: "Hủy đơn" });
        }
    } catch (error) { res.status(500).json({ message: "Lỗi check PayOS" }); }
};

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus, deleteOrder, lookupOrder, createPaymentLink, getPaymentInfo };