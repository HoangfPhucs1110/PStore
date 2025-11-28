const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("PStore API v2"));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/carts", require("./routes/cartRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/wishlists", require("./routes/wishlistRoutes"));
app.use("/api/banners", require("./routes/bannerRoutes"));
app.use("/api/coupons", require("./routes/couponRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin/users", require("./routes/adminUserRoutes"));
app.use("/uploads", express.static("uploads"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on", PORT));
