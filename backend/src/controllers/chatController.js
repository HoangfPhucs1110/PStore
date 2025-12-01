const Message = require("../models/Message");
const User = require("../models/User");

// 1. Gửi tin nhắn
const saveMessage = async (req, res) => {
  try {
    const { message } = req.body; 
    const senderId = req.user._id;

    // --- SỬA LOGIC TẠI ĐÂY ---
    // Ưu tiên 1: Lấy từ body (Trường hợp Admin chat trong trang quản lý)
    // Ưu tiên 2: Lấy ID người gửi (Trường hợp Khách chat, hoặc Admin test Widget)
    let chatRoomId = req.body.chatRoomId;

    if (!chatRoomId) {
        chatRoomId = senderId.toString();
    }

    const newMessage = await Message.create({
      chatRoomId,
      sender: senderId,
      message,
      isRead: false
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Chat Error:", error); // Log lỗi ra console server để dễ debug
    res.status(500).json({ message: error.message });
  }
};

// 2. Lấy lịch sử chat
const getMessages = async (req, res) => {
  try {
    let chatRoomId = req.params.roomId;
    // Nếu là user thường, chỉ được xem phòng của mình
    if (req.user.role === 'user') {
        chatRoomId = req.user._id.toString();
    }

    const messages = await Message.find({ chatRoomId })
      .populate("sender", "name role avatarUrl")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Admin: Lấy danh sách hội thoại
const getConversations = async (req, res) => {
  try {
    const conversations = await Message.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$chatRoomId",
          lastMessage: { $first: "$message" },
          sender: { $first: "$sender" },
          createdAt: { $first: "$createdAt" },
          isRead: { $first: "$isRead" }
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    await User.populate(conversations, { path: "_id", select: "name email avatarUrl" });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { saveMessage, getMessages, getConversations };