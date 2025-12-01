const Contact = require("../models/Contact");
const sendEmail = require("../utils/sendEmail");

// 1. Khách gửi liên hệ
const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const contact = await Contact.create({ name, email, subject, message });
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Admin lấy danh sách liên hệ
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Admin xóa liên hệ
const deleteContact = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa liên hệ" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Admin phản hồi (Gửi Email)
const replyContact = async (req, res) => {
  try {
    const { replyMessage } = req.body;
    const contact = await Contact.findById(req.params.id);

    if (!contact) return res.status(404).json({ message: "Không tìm thấy liên hệ" });

    // Nội dung email HTML
    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #2563eb;">Phản hồi từ PStore</h2>
        <p>Xin chào <strong>${contact.name}</strong>,</p>
        <p>Cảm ơn bạn đã liên hệ với chúng tôi về vấn đề: <strong>"${contact.subject}"</strong>.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p><strong>Nội dung phản hồi:</strong></p>
        <p style="background-color: #f8fafc; padding: 15px; border-radius: 5px; color: #333;">
          ${replyMessage.replace(/\n/g, '<br>')}
        </p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 14px; color: #666;">
          Trân trọng,<br>
          Đội ngũ PStore
        </p>
      </div>
    `;

    // Gửi email
    await sendEmail({
      email: contact.email,
      subject: `[PStore] Phản hồi: ${contact.subject}`,
      message: emailTemplate,
    });

    // Cập nhật trạng thái trong DB
    contact.status = "replied";
    contact.replyMessage = replyMessage;
    contact.repliedAt = Date.now();
    await contact.save();

    res.json({ message: "Đã gửi phản hồi thành công" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi gửi email phản hồi" });
  }
};

module.exports = { createContact, getAllContacts, deleteContact, replyContact };