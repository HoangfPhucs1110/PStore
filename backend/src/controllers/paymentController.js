const PayOS = require("@payos/node");
const Order = require("../models/Order");

const PayOSConstructor = PayOS.PayOS || PayOS;

let payos;
try {
    payos = new PayOSConstructor(
        process.env.PAYOS_CLIENT_ID,
        process.env.PAYOS_API_KEY,
        process.env.PAYOS_CHECKSUM_KEY
    );
    console.log("✅ PayOS Init OK.");
} catch (err) {
    console.error("❌ Lỗi Init PayOS:", err.message);
}

// 1. Tạo Link Thanh Toán
const createPaymentLink = async (req, res) => {
    try {
        const { orderId, amount } = req.body;
        
        if (!payos) return res.status(500).json({ message: "Chưa khởi tạo PayOS" });

        const orderCode = Number(String(Date.now()).slice(-6) + Math.floor(Math.random() * 1000));
        await Order.findByIdAndUpdate(orderId, { orderCode: orderCode });

        const body = {
            orderCode: orderCode,
            amount: Math.round(Number(amount)),
            description: `Thanh toan ${orderCode}`,
            items: [], 
            returnUrl: `${process.env.CLIENT_URL || "http://localhost:3000"}/payment-result`, 
            cancelUrl: `${process.env.CLIENT_URL || "http://localhost:3000"}/payment-result` 
        };

        const paymentLinkRes = await payos.paymentRequests.create(body);

        res.json({ 
            paymentUrl: paymentLinkRes.checkoutUrl 
        });

    } catch (error) {
        console.error("----- LỖI TẠO LINK -----");
        console.error(error);
        res.status(500).json({ message: "Lỗi tạo link PayOS", error: error.message });
    }
};

// 2. Lấy thông tin & Xử lý kết quả
const getPaymentInfo = async (req, res) => {
    try {
        const { orderCode } = req.body;
        
        const paymentLinkInfo = await payos.paymentRequests.get(orderCode);

        if (paymentLinkInfo && paymentLinkInfo.status === "PAID") {
            await Order.findOneAndUpdate({ orderCode: orderCode }, {
                paymentStatus: "paid",
                paymentMethod: "PAYOS"
            });
            res.json({ code: "00", message: "Thành công", data: paymentLinkInfo });
        } else {
            await Order.findOneAndDelete({ orderCode: orderCode });
            res.json({ code: "01", message: "Giao dịch bị hủy, đơn hàng đã bị xóa." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi kiểm tra trạng thái" });
    }
};

module.exports = { createPaymentLink, getPaymentInfo };