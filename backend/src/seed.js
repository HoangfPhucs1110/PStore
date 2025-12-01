require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Import Models
const User = require("./models/User");
const Product = require("./models/Product");
const Category = require("./models/Category");
const Order = require("./models/Order");
const Review = require("./models/Review");
const Coupon = require("./models/Coupon");
const Banner = require("./models/Banner");
const Contact = require("./models/Contact");
const Subscriber = require("./models/Subscriber");

// --- CẤU HÌNH KẾT NỐI ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Đã kết nối MongoDB");
  } catch (error) {
    console.error("❌ Lỗi kết nối MongoDB:", error.message);
    process.exit(1);
  }
};

// --- UTILS ---
const slugify = (text) => text.toString().toLowerCase()
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .replace(/\s+/g, '-')
  .replace(/[^\w\-]+/g, '')
  .replace(/\-\-+/g, '-')
  .replace(/^-+/, '')
  .replace(/-+$/, '');

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomPick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// --- DỮ LIỆU TÊN NGƯỜI VIỆT ---
const VIETNAMESE_NAMES = [
  "Nguyễn Văn An", "Trần Thị Bích", "Lê Văn Cường", "Phạm Thị Dung", "Hoàng Văn Em",
  "Đặng Thị Hoa", "Bùi Văn Giang", "Đỗ Thị Hạnh", "Ngô Văn Hùng", "Vũ Thị Kim",
  "Dương Văn Lâm", "Lý Thị Mai", "Lương Văn Nam", "Phan Thị Oanh", "Võ Văn Phúc",
  "Trương Thị Quyên", "Đinh Văn Rồng", "Hà Thị Sương", "Kiều Văn Tài", "Lâm Thị Uyên"
];

// --- DỮ LIỆU SẢN PHẨM THẬT (8 Danh mục) ---
const REAL_DATA = {
  "laptop-van-phong": [
    { name: "MacBook Air M2 13 inch 2023", brand: "Apple", price: 26990000 },
    { name: "Dell XPS 13 Plus 9320", brand: "Dell", price: 45990000 },
    { name: "HP Envy x360 13", brand: "HP", price: 22990000 },
    { name: "Asus Zenbook 14 OLED", brand: "ASUS", price: 24990000 },
    { name: "Lenovo ThinkPad X1 Carbon Gen 10", brand: "Lenovo", price: 42990000 },
    { name: "LG Gram 16 2023", brand: "LG", price: 32990000 },
    { name: "Surface Laptop 5 13.5 inch", brand: "Microsoft", price: 29990000 },
    { name: "MSI Modern 14 C11M", brand: "MSI", price: 12990000 },
    { name: "Acer Swift 5 Aerospace", brand: "Acer", price: 27990000 },
    { name: "Huawei MateBook D15", brand: "Huawei", price: 14990000 }
  ],
  "laptop-gaming": [
    { name: "ASUS ROG Strix G16 G614", brand: "ASUS", price: 32990000 },
    { name: "MSI Raider GE78 HX", brand: "MSI", price: 99990000 },
    { name: "Alienware m16 R1", brand: "Dell", price: 65990000 },
    { name: "Lenovo Legion 5 Pro 2024", brand: "Lenovo", price: 38990000 },
    { name: "Acer Predator Helios 16", brand: "Acer", price: 44990000 },
    { name: "HP Omen 16 2023", brand: "HP", price: 35990000 },
    { name: "Razer Blade 15 Advanced", brand: "Razer", price: 79990000 },
    { name: "Gigabyte Aorus 15", brand: "Gigabyte", price: 41990000 },
    { name: "MSI Cyborg 15", brand: "MSI", price: 19990000 },
    { name: "Asus TUF Gaming F15", brand: "ASUS", price: 21990000 }
  ],
  "man-hinh": [
    { name: "LG UltraGear 27GR95QE OLED", brand: "LG", price: 23990000 },
    { name: "Samsung Odyssey G9 OLED", brand: "Samsung", price: 39990000 },
    { name: "Dell UltraSharp U2723QE", brand: "Dell", price: 13990000 },
    { name: "Asus ProArt PA279CV", brand: "ASUS", price: 10990000 },
    { name: "ViewSonic VX2758-2KP-MHD", brand: "ViewSonic", price: 6990000 },
    { name: "Gigabyte G24F 2", brand: "Gigabyte", price: 3590000 },
    { name: "AOC 24G2SP", brand: "AOC", price: 3290000 },
    { name: "MSI Optix MAG274QRF", brand: "MSI", price: 9990000 },
    { name: "BenQ Zowie XL2546K", brand: "BenQ", price: 12990000 },
    { name: "Samsung Odyssey G5 2K", brand: "Samsung", price: 6590000 }
  ],
  "ban-phim": [
    { name: "Keychron Q1 Pro Wireless", brand: "Keychron", price: 4490000 },
    { name: "Logitech G915 TKL", brand: "Logitech", price: 4990000 },
    { name: "Akko MonsGeek M1", brand: "Akko", price: 2990000 },
    { name: "Razer BlackWidow V4 Pro", brand: "Razer", price: 5490000 },
    { name: "Corsair K70 RGB PRO", brand: "Corsair", price: 3890000 },
    { name: "Leopold FC750R Bluetooth", brand: "Leopold", price: 3450000 },
    { name: "SteelSeries Apex Pro TKL", brand: "SteelSeries", price: 4690000 },
    { name: "Ducky One 3 Daybreak", brand: "Ducky", price: 3100000 },
    { name: "Asus ROG Azoth", brand: "ASUS", price: 6990000 },
    { name: "Glorious GMMK Pro", brand: "Glorious", price: 4190000 }
  ],
  "chuot": [
    { name: "Logitech G Pro X Superlight 2", brand: "Logitech", price: 3490000 },
    { name: "Razer DeathAdder V3 Pro", brand: "Razer", price: 3590000 },
    { name: "Pulsar X2 Mini", brand: "Pulsar", price: 1990000 },
    { name: "Lamzu Atlantis OG V2", brand: "Lamzu", price: 2190000 },
    { name: "Zowie EC2-CW Wireless", brand: "Zowie", price: 3490000 },
    { name: "Razer Viper V2 Pro", brand: "Razer", price: 3190000 },
    { name: "Glorious Model O 2 Wireless", brand: "Glorious", price: 2490000 },
    { name: "SteelSeries Aerox 3", brand: "SteelSeries", price: 1490000 },
    { name: "Logitech G502 X Plus", brand: "Logitech", price: 3290000 },
    { name: "Asus ROG Harpe Ace", brand: "ASUS", price: 2990000 }
  ],
  "tai-nghe": [
    { name: "Sony WH-1000XM5", brand: "Sony", price: 7990000 },
    { name: "HyperX Cloud II Wireless", brand: "HyperX", price: 3490000 },
    { name: "Logitech G Pro X 2 Lightspeed", brand: "Logitech", price: 5690000 },
    { name: "SteelSeries Arctis Nova Pro", brand: "SteelSeries", price: 8290000 },
    { name: "Razer BlackShark V2 Pro 2023", brand: "Razer", price: 4290000 },
    { name: "Corsair Virtuoso RGB XT", brand: "Corsair", price: 5490000 },
    { name: "JBL Quantum One", brand: "JBL", price: 4990000 },
    { name: "Sennheiser HD 560S", brand: "Sennheiser", price: 4590000 },
    { name: "Sony Inzone H9", brand: "Sony", price: 5990000 },
    { name: "Asus ROG Delta S Wireless", brand: "ASUS", price: 4690000 }
  ],
  "ghe-gaming": [
    { name: "Secretlab TITAN Evo 2022", brand: "Secretlab", price: 13990000 },
    { name: "AndaSeat Kaiser 3", brand: "AndaSeat", price: 9900000 },
    { name: "Razer Iskur XL", brand: "Razer", price: 12990000 },
    { name: "Corsair T3 Rush", brand: "Corsair", price: 6900000 },
    { name: "MSI MAG CH120", brand: "MSI", price: 4500000 },
    { name: "Noblechairs HERO", brand: "Noblechairs", price: 14500000 },
    { name: "DXRacer Master Series", brand: "DXRacer", price: 11000000 },
    { name: "E-Dra Hercules EGC203", brand: "E-Dra", price: 2890000 },
    { name: "Warrior WGC206", brand: "Warrior", price: 2390000 },
    { name: "Cougar Armor Titan Pro", brand: "Cougar", price: 8900000 }
  ],
  "tay-cam": [
    { name: "Sony DualSense Edge", brand: "Sony", price: 5490000 },
    { name: "Sony DualSense PS5", brand: "Sony", price: 1690000 },
    { name: "Xbox Elite Series 2", brand: "Microsoft", price: 3990000 },
    { name: "Xbox Wireless Controller", brand: "Microsoft", price: 1490000 },
    { name: "8BitDo Pro 2", brand: "8BitDo", price: 1100000 },
    { name: "8BitDo Ultimate Bluetooth", brand: "8BitDo", price: 1650000 },
    { name: "Razer Wolverine V2 Chroma", brand: "Razer", price: 3690000 },
    { name: "Gamesir T4 Pro", brand: "Gamesir", price: 750000 },
    { name: "Flydigi Vader 3 Pro", brand: "Flydigi", price: 1290000 },
    { name: "Gulikit KingKong 2 Pro", brand: "Gulikit", price: 990000 }
  ]
};

// Placeholder images (Ảnh minh họa từ Unsplash)
const PLACEHOLDER_IMGS = {
  "laptop-van-phong": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800",
  "laptop-gaming": "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800",
  "man-hinh": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800",
  "ban-phim": "https://images.unsplash.com/photo-1587829741301-dc798b91a603?w=800",
  "chuot": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800",
  "tai-nghe": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
  "ghe-gaming": "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800",
  "tay-cam": "https://images.unsplash.com/photo-1600080972464-8e5f35f63d88?w=800"
};

// --- HÀM TẠO THÔNG SỐ KỸ THUẬT (QUAN TRỌNG) ---
const getSpecs = (category, name) => {
  const c = category;
  if (c.includes('laptop')) {
    const isGaming = c.includes('gaming');
    return {
      "CPU": isGaming ? randomPick(["Core i5-13500H", "Core i7-13700H", "Core i9-13900HX", "Ryzen 7 7840HS", "Ryzen 9 7945HX"]) : randomPick(["Core i5-1340P", "Core i7-1360P", "M2", "M3", "Ryzen 5 7530U"]),
      "RAM": isGaming ? randomPick(["16GB DDR5", "32GB DDR5"]) : randomPick(["8GB LPDDR5", "16GB LPDDR5", "8GB DDR4"]),
      "SSD": randomPick(["512GB NVMe PCIe 4.0", "1TB NVMe PCIe 4.0", "2TB NVMe"]),
      "VGA": isGaming ? randomPick(["RTX 4050 6GB", "RTX 4060 8GB", "RTX 4070 8GB", "RTX 4080 12GB"]) : "Intel Iris Xe / AMD Radeon",
      "Màn hình": isGaming ? randomPick(["15.6 FHD 144Hz", "16 2K+ 240Hz", "16 QHD+ 165Hz"]) : randomPick(["13.3 Retina", "14 OLED 2.8K", "14 FHD IPS"]),
      "Pin": isGaming ? "90Wh" : "50Wh - 70Wh",
      "Trọng lượng": isGaming ? "2.3 kg" : "1.2 kg - 1.5 kg"
    };
  }
  if (c === 'man-hinh') return {
    "Tấm nền": randomPick(["IPS", "Fast IPS", "OLED", "VA"]),
    "Tần số quét": randomPick(["144Hz", "165Hz", "180Hz", "240Hz", "360Hz"]),
    "Độ phân giải": randomPick(["FHD (1920x1080)", "2K QHD (2560x1440)", "4K UHD"]),
    "Kích thước": randomPick(["24 inch", "27 inch", "32 inch"]),
    "Phản hồi": randomPick(["1ms (GtG)", "0.5ms", "0.03ms (GtG)"]),
    "Màu sắc": "1.07 tỷ màu (10-bit)"
  };
  if (c === 'ban-phim') return {
    "Switch": randomPick(["Red Switch", "Blue Switch", "Brown Switch", "Silver Speed", "Banana Switch"]),
    "Kết nối": randomPick(["Type-C", "Bluetooth 5.1", "Wireless 2.4GHz", "3 Modes"]),
    "Keycap": randomPick(["PBT Double-shot", "ABS Double-shot"]),
    "Layout": randomPick(["60%", "65%", "75%", "TKL (87 phím)", "Fullsize"]),
    "LED": "RGB 16.8 triệu màu"
  };
  if (c === 'chuot') return {
    "DPI": randomPick(["16000", "20000", "26000", "30000"]),
    "Cảm biến": randomPick(["Optical Focus+", "Hero 25K", "PAW3395"]),
    "Kết nối": randomPick(["Wireless 2.4GHz", "Bluetooth", "Wired"]),
    "Trọng lượng": `${randomInt(50, 80)}g`,
    "Pin": `${randomInt(70, 100)} giờ`
  };
  if (c === 'tai-nghe') return {
    "Driver": "50mm Neodymium",
    "Kết nối": randomPick(["Wireless 2.4GHz", "Bluetooth 5.2", "USB", "3.5mm"]),
    "Âm thanh": randomPick(["7.1 Surround", "Stereo", "Spatial Audio"]),
    "Microphone": "Khử ồn AI",
    "Pin": "40 giờ - 80 giờ"
  };
  if (c === 'ghe-gaming') return {
    "Chất liệu": randomPick(["Da PU cao cấp", "Vải Fabric", "Da Nappa", "Lưới Mesh"]),
    "Trụ thủy lực": "Class 4 SGS",
    "Ngả lưng": "90 - 180 độ",
    "Tải trọng": "150kg",
    "Kê tay": "4D"
  };
  if (c === 'tay-cam') return {
    "Kết nối": randomPick(["Wireless", "Bluetooth", "Wired USB-C"]),
    "Tương thích": "PC, PS5, Xbox, Switch, Android",
    "Rung": "Haptic Feedback",
    "Pin": "1000mAh (20 giờ)"
  };
  return {};
};

// --- HÀM TẠO DỮ LIỆU ---

const generateUsers = async () => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("123456", salt);
  
  const users = [
    { 
      name: "Admin Quản Trị", email: "admin@pstore.vn", passwordHash: hashedPassword, role: "admin", 
      phone: "0909000111", avatarUrl: "https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff",
      addresses: [{ label: "Văn phòng", fullName: "Admin", phone: "0909000111", address: "Tòa nhà Bitexco, Q1, TP.HCM", isDefault: true }]
    },
    { 
      name: "Nhân Viên Sale", email: "staff@pstore.vn", passwordHash: hashedPassword, role: "staff", 
      phone: "0909000222", avatarUrl: "https://ui-avatars.com/api/?name=Staff&background=6c757d&color=fff" 
    }
  ];

  VIETNAMESE_NAMES.forEach((name, index) => {
    users.push({
      name: name,
      email: `user${index + 1}@gmail.com`,
      passwordHash: hashedPassword,
      role: "user",
      phone: `09${randomInt(10000000, 99999999)}`,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
      addresses: [
        { label: "Nhà riêng", fullName: name, phone: `09${randomInt(10000000, 99999999)}`, address: `Số ${randomInt(1, 100)} Đường Nguyễn Huệ, Quận ${randomInt(1,12)}, TP.HCM`, isDefault: true }
      ]
    });
  });
  return users;
};

const generateProducts = () => {
  let products = [];
  const categories = Object.keys(REAL_DATA);

  categories.forEach(cat => {
    const items = REAL_DATA[cat];
    items.forEach((item, i) => {
      // TÍNH GIÁ GỐC & LỢI NHUẬN
      const importPrice = Math.round(item.price * (randomInt(60, 80) / 100));

      products.push({
        name: item.name,
        slug: slugify(`${item.name}-${randomInt(1000,9999)}`),
        categorySlug: cat,
        brand: item.brand,
        price: item.price,
        importPrice: importPrice,
        oldPrice: item.price + randomInt(1, 10) * 500000,
        stock: randomInt(0, 50),
        isFeatured: i < 3,
        isNew: i < 4,
        images: [PLACEHOLDER_IMGS[cat], PLACEHOLDER_IMGS[cat]],
        thumbnail: PLACEHOLDER_IMGS[cat],
        sku: `${cat.substring(0,3).toUpperCase()}-${randomInt(10000,99999)}`,
        description: `Sản phẩm ${item.name} chính hãng ${item.brand}. Bảo hành 12 tháng.`,
        specs: getSpecs(cat, item.name) // <--- TẠO THÔNG SỐ KỸ THUẬT
      });
    });
  });
  return products;
};

// --- HÀM SEED CHÍNH ---
const seedData = async () => {
  await connectDB();
  console.log("🔥 Đang xóa dữ liệu cũ...");
  
  try {
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Category.deleteMany({}),
      Order.deleteMany({}),
      Review.deleteMany({}),
      Coupon.deleteMany({}),
      Banner.deleteMany({}),
      Contact.deleteMany({}),
      Subscriber.deleteMany({})
    ]);
  } catch (e) {
    console.log("Lỗi xóa dữ liệu cũ (có thể bỏ qua):", e.message);
  }

  // 1. Categories
  console.log("📂 Creating Categories...");
  const categoriesData = [
    { name: "Laptop Văn Phòng", slug: "laptop-van-phong", icon: PLACEHOLDER_IMGS["laptop-van-phong"], sortOrder: 1 },
    { name: "Laptop Gaming", slug: "laptop-gaming", icon: PLACEHOLDER_IMGS["laptop-gaming"], sortOrder: 2 },
    { name: "Màn hình", slug: "man-hinh", icon: PLACEHOLDER_IMGS["man-hinh"], sortOrder: 3 },
    { name: "Bàn phím", slug: "ban-phim", icon: PLACEHOLDER_IMGS["ban-phim"], sortOrder: 4 },
    { name: "Chuột", slug: "chuot", icon: PLACEHOLDER_IMGS["chuot"], sortOrder: 5 },
    { name: "Tai nghe", slug: "tai-nghe", icon: PLACEHOLDER_IMGS["tai-nghe"], sortOrder: 6 },
    { name: "Ghế Gaming", slug: "ghe-gaming", icon: PLACEHOLDER_IMGS["ghe-gaming"], sortOrder: 7 },
    { name: "Tay cầm", slug: "tay-cam", icon: PLACEHOLDER_IMGS["tay-cam"], sortOrder: 8 }
  ];
  await Category.insertMany(categoriesData);

  // 2. Users
  console.log("👤 Creating Users...");
  const users = await User.insertMany(await generateUsers());
  const customers = users.filter(u => u.role === "user");

  // 3. Products
  console.log("💻 Creating 80 Products with Full Specs...");
  const products = await Product.insertMany(generateProducts());

  // 4. Reviews
  console.log("⭐ Creating 300 Reviews...");
  const reviews = [];
  const comments = [
    "Sản phẩm rất tốt, giao hàng nhanh.", "Đóng gói cẩn thận, shop tư vấn nhiệt tình.",
    "Hàng chính hãng, check serial ok.", "Dùng ổn trong tầm giá.", "Sẽ ủng hộ lần sau.",
    "Giá tốt nhất thị trường.", "Chất lượng hoàn thiện cao.", "Màu sắc đẹp như hình."
  ];

  for (let i = 0; i < 300; i++) {
    const user = randomPick(customers);
    const product = randomPick(products);
    const exists = reviews.find(r => r.user === user._id && r.product === product._id);
    if (!exists) {
      reviews.push({
        user: user._id,
        product: product._id,
        rating: randomInt(4, 5),
        comment: randomPick(comments)
      });
    }
  }
  await Review.insertMany(reviews);

  // 5. Orders (Fix Shipping Info + Profit)
  console.log("📦 Creating 40 Orders...");
  const orders = [];
  
  try {
    for (let i = 0; i < 40; i++) {
      const user = randomPick(customers);
      const item1 = randomPick(products);
      if (!item1) continue;

      const qty1 = randomInt(1, 2);
      
      const itemsPrice = item1.price * qty1;
      const total = itemsPrice > 1000000 ? itemsPrice : itemsPrice + 30000;
      
      const basePrice = item1.importPrice || Math.round(item1.price * 0.7);
      const profit = (item1.price - basePrice) * qty1;

      const userAddr = user.addresses && user.addresses.length > 0 ? user.addresses[0] : null;
      if (!userAddr) continue;

      const shippingInfo = {
        fullName: userAddr.fullName || user.name,
        phone: userAddr.phone || user.phone,
        address: userAddr.address || "Địa chỉ mặc định",
        note: ""
      };

      orders.push({
        userId: user._id,
        items: [{ 
          productId: item1._id, nameSnapshot: item1.name, priceSnapshot: item1.price, imageSnapshot: item1.thumbnail, qty: qty1 
        }],
        itemsPrice: itemsPrice,
        shippingPrice: itemsPrice > 1000000 ? 0 : 30000,
        total: total,
        totalProfit: profit,
        shippingInfo: shippingInfo,
        paymentMethod: randomPick(["COD", "PAYOS"]),
        paymentStatus: randomPick(["unpaid", "paid"]),
        status: randomPick(["pending", "shipping", "completed", "canceled"]),
        code: `ORD-${2024}${randomInt(1000, 9999)}`,
        createdAt: new Date(Date.now() - randomInt(0, 60) * 24 * 60 * 60 * 1000)
      });
    }
    
    if (orders.length > 0) {
      await Order.insertMany(orders);
    }

  } catch (err) { console.error("Order Error:", err.message); }

  // 6. Coupons & Others
  console.log("🎟️ Creating Coupons & Contacts...");
  await Coupon.insertMany([
    { code: "PSTORE10", type: "percent", value: 10, minOrder: 0, maxDiscount: 200000, usageLimit: 100, endDate: new Date("2025-12-31") },
    { code: "GIAM50K", type: "fixed", value: 50000, minOrder: 1000000, usageLimit: 50, endDate: new Date("2025-12-31") },
    { code: "FREESHIP", type: "fixed", value: 30000, minOrder: 500000, usageLimit: 500, endDate: new Date("2025-12-31") }
  ]);

  await Contact.insertMany([
    { name: "Công ty ABC", email: "contact@abc.com", subject: "Hợp tác phân phối", message: "Muốn làm đại lý.", status: "replied", replyMessage: "Đã gửi mail.", repliedAt: new Date() },
    { name: "Nguyễn Văn A", email: "a@gmail.com", subject: "Khiếu nại", message: "Giao sai màu.", status: "new" }
  ]);

  const subscribers = Array.from({length: 30}).map((_, i) => ({ email: `nguoidung${i+1}@gmail.com` }));
  await Subscriber.insertMany(subscribers);

  await Banner.insertMany([
    { title: "Siêu Sale 2025", subTitle: "Giảm giá lên đến 50%", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200", position: "hero", sortOrder: 1 },
    { title: "Laptop Gaming", subTitle: "Chiến game đỉnh cao", image: "https://images.unsplash.com/photo-1593642632823-8f78536788c6?w=1200", position: "hero", sortOrder: 2 }
  ]);

  console.log("✅ SEED DATA COMPLETED (FULL SPECS & PROFIT)!");
  console.log("👉 Admin: admin@pstore.vn / 123456");
  process.exit();
};

seedData();