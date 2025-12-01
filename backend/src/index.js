require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Kết nối Database
connectDB();

// --- ĐĂNG KÝ ROUTE ---
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/wishlists", require("./routes/wishlistRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/coupons", require("./routes/couponRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));
app.use("/api", require("./routes/otherRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/chat", chatRoutes);

// --- CẤU HÌNH SOCKET.IO ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  // 1. Tham gia phòng chat (Mỗi User có 1 phòng riêng theo ID của họ)
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  // 2. Gửi tin nhắn
  socket.on("send_message", (data) => {
    // data gồm: { chatRoomId, sender, message, ... }
    // Gửi tin nhắn đến tất cả người trong phòng này (User và Admin đang xem phòng đó)
    socket.to(data.chatRoomId).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));