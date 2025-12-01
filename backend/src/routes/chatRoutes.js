const express = require("express");
const router = express.Router();
const { saveMessage, getMessages, getConversations } = require("../controllers/chatController");
const { protect, admin } = require("../middleware/auth");

// Gửi tin nhắn (Cả khách và Admin đều dùng)
router.post("/", protect, saveMessage);

// Lấy tin nhắn của user hiện tại (Khách) hoặc theo ID (Admin)
router.get("/:roomId", protect, getMessages);

// Admin lấy danh sách các user đã chat
router.get("/admin/conversations", protect, admin, getConversations);

module.exports = router;