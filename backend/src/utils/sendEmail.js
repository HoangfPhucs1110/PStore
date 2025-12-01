const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1. Khởi tạo transporter với thông tin từ .env
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // false cho port 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS, // Mật khẩu ứng dụng của bạn
    },
  });

  // 2. Cấu hình nội dung email
  const message = {
    from: `"PStore Support" <${process.env.SMTP_USER}>`, // Người gửi
    to: options.email, // Người nhận
    subject: options.subject, // Tiêu đề
    html: options.message, // Nội dung HTML
  };

  // 3. Thực hiện gửi
  const info = await transporter.sendMail(message);
  console.log("Message sent: %s", info.messageId);
};

module.exports = sendEmail;