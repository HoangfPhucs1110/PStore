require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const http = require("http"); // <--- MỚI
const { Server } = require("socket.io"); // <--- MỚI
const Message = require("./models/Message"); // Sẽ tạo ở bước sau

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Connect DB
connectDB();

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/wishlists", require("./routes/wishlistRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api", require("./routes/otherRoutes"));
// app.use("/api/chat", require("./routes/chatRoutes")); // Nếu bạn muốn làm API lấy lịch sử chat sau này

// --- SOCKET.IO SETUP ---
const server = http.createServer(app); // Tạo HTTP Server
const io = new Server(server, {
  cors: {
    origin: "*", // Cho phép mọi domain kết nối (cần siết chặt khi deploy)
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // User tham gia vào phòng chat riêng (dựa trên ID của họ)
  socket.on("join_room", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room ${userId}`);
  });

  // Gửi tin nhắn
  socket.on("send_message", async (data) => {
    // data = { senderId, receiverId, text, isAdminMsg }
    
    // Lưu tin nhắn vào DB (Tùy chọn, nên làm để không mất tin nhắn)
    try {
        await Message.create(data);
    } catch(e) { console.error(e); }

    // Gửi tin nhắn đến phòng của người nhận
    // Nếu là khách gửi -> Gửi cho Admin (Admin sẽ lắng nghe sự kiện chung hoặc join room user)
    // Nếu là Admin gửi -> Gửi vào phòng của User (receiverId)
    socket.to(data.receiverId).emit("receive_message", data);
    
    // Nếu người gửi là khách, thông báo cho toàn bộ Admin/Staff biết có tin mới
    if (!data.isAdminMsg) {
        socket.broadcast.emit("new_user_message", data);
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});
// -----------------------

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Dùng server.listen thay vì app.listen