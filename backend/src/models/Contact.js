const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { 
      type: String, 
      enum: ["new", "replied"], 
      default: "new" 
    },
    replyMessage: { type: String }, // Nội dung admin đã trả lời
    repliedAt: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);