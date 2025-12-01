const Subscriber = require("../models/Subscriber");
const sendEmail = require("../utils/sendEmail");

// --- 1. KHÁCH ĐĂNG KÝ NHẬN TIN (Gửi email xác nhận) ---
const subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Validate email
    if (!email || !email.includes("@")) {
      return res.status(400).json({ message: "Vui lòng nhập địa chỉ email hợp lệ." });
    }

    // Kiểm tra trùng lặp
    const exists = await Subscriber.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email này đã được đăng ký trước đó." });
    }

    // Lưu vào Database
    await Subscriber.create({ email });

    // Tạo link hủy đăng ký (Trỏ về Frontend)
    const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
    const unsubscribeLink = `${clientUrl}/unsubscribe?email=${encodeURIComponent(email)}`;
    const shopLink = `${clientUrl}/products`;

    // Nội dung Email HTML
    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
        <div style="text-align: center; border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 20px;">
          <h1 style="color: #2563eb; margin: 0;">PStore</h1>
          <p style="color: #666; margin: 5px 0 0;">Công nghệ đỉnh cao - Giá tốt nhất</p>
        </div>
        
        <h2 style="color: #333;">Xin chào! 👋</h2>
        <p style="font-size: 16px; line-height: 1.5; color: #555;">
          Cảm ơn bạn đã đăng ký nhận bản tin từ <strong>PStore</strong>. 
          Bạn đã chính thức gia nhập cộng đồng những người yêu công nghệ của chúng tôi.
        </p>
        
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0; font-weight: bold; color: #333;">Quyền lợi thành viên:</p>
          <ul style="color: #555; padding-left: 20px; margin-top: 10px;">
            <li>🔥 Cập nhật sớm nhất về các sản phẩm mới (Laptop, Gear, PC).</li>
            <li>🎁 Nhận mã giảm giá độc quyền dành riêng cho bạn.</li>
            <li>💡 Mẹo hay sử dụng và bảo quản thiết bị công nghệ.</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${shopLink}" style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 50px; font-weight: bold; font-size: 16px;">Khám phá cửa hàng ngay</a>
        </div>

        <p style="font-size: 14px; color: #888; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
          Nếu bạn không muốn nhận tin nữa, vui lòng <a href="${unsubscribeLink}" style="color: #ef4444;">hủy đăng ký tại đây</a>.<br>
          Trân trọng,<br>
          <strong>Đội ngũ PStore</strong>
        </p>
      </div>
    `;

    // Gửi email
    try {
      await sendEmail({
        email: email,
        subject: "🎉 Chào mừng bạn đến với PStore!",
        message: emailTemplate,
      });
    } catch (emailError) {
      console.error("Gửi email thất bại:", emailError);
    }

    res.status(201).json({ message: "Đăng ký thành công! Hãy kiểm tra email của bạn." });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server, vui lòng thử lại sau." });
  }
};

// --- 2. KHÁCH HỦY ĐĂNG KÝ (Unsubscribe) ---
const unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;
    const deleted = await Subscriber.findOneAndDelete({ email });
    
    if (!deleted) {
      return res.status(404).json({ message: "Email không tồn tại trong hệ thống." });
    }
    
    res.json({ message: "Đã hủy đăng ký thành công." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- 3. ADMIN: LẤY DANH SÁCH ---
const getAllSubscribers = async (req, res) => {
  try {
    const list = await Subscriber.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- 4. ADMIN: XÓA NGƯỜI ĐĂNG KÝ ---
const deleteSubscriber = async (req, res) => {
  try {
    await Subscriber.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa email khỏi danh sách." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  subscribe, 
  unsubscribe, 
  getAllSubscribers, 
  deleteSubscriber 
};