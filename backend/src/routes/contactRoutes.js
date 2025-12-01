const express = require("express");
const router = express.Router();
const { createContact, getAllContacts, deleteContact, replyContact } = require("../controllers/contactController");
const { protect, admin } = require("../middleware/auth");

// Public - Khách gửi tin nhắn
router.post("/", createContact);

// Admin - Quản lý tin nhắn
router.get("/", protect, admin, getAllContacts);
router.delete("/:id", protect, admin, deleteContact);
router.post("/:id/reply", protect, admin, replyContact);

module.exports = router;