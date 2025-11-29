// backend/seed.js
require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pstore";

const baseFields = {
  images: [],
  thumbnail: undefined,
  stock: 20,
  status: "active",
  isFeatured: false,
  isNew: false,
  soldCount: 0,
  ratingAvg: 0,
  ratingCount: 0
};

/* ========== LAPTOP (10) ========== */
const laptops = [
  {
    name: "ASUS TUF Gaming F15 FX506HF",
    slug: "asus-tuf-gaming-f15-fx506hf",
    categorySlug: "laptop",
    brand: "ASUS",
    price: 22990000,
    oldPrice: 24990000,
    sku: "LAP-ASUS-TUF-F15-HF",
    shortDescription:
      "Laptop gaming 15.6 inch, i5 H-series, RTX 2050, phù hợp game và học tập.",
    description:
      "ASUS TUF Gaming F15 FX506HF trang bị CPU Intel Core i5 H-series, RAM 16GB, SSD NVMe và GPU RTX 2050, màn hình 144Hz, vỏ đạt chuẩn quân đội bền bỉ.",
    tags: ["laptop", "gaming", "asus", "tuf"],
    specs: {
      cpu: "Intel Core i5-11400H",
      ram: "16GB DDR4 3200MHz",
      storage: "512GB SSD NVMe",
      gpu: "NVIDIA GeForce RTX 2050 4GB",
      display: '15.6" FHD 144Hz IPS',
      os: "Windows 11 Home",
      weight: "2.3kg",
      ports: "USB-A, USB-C, HDMI, LAN, Audio"
    }
  },
  {
    name: "Acer Nitro 5 AN515 Ryzen 5 RTX 3050",
    slug: "acer-nitro-5-an515-ryzen5-rtx3050",
    categorySlug: "laptop",
    brand: "Acer",
    price: 21990000,
    oldPrice: 23990000,
    sku: "LAP-ACER-NITRO5-R5",
    shortDescription:
      "Nitro 5 Ryzen 5, RTX 3050, màn 144Hz cho game thủ phổ thông.",
    description:
      "Acer Nitro 5 AN515 dùng CPU Ryzen 5 5600H, RTX 3050, RAM 16GB, SSD 512GB, tản nhiệt tốt, phù hợp game eSports và đồ họa nhẹ.",
    tags: ["laptop", "gaming", "acer", "nitro5"],
    specs: {
      cpu: "AMD Ryzen 5 5600H",
      ram: "16GB DDR4",
      storage: "512GB SSD NVMe",
      gpu: "NVIDIA GeForce RTX 3050 4GB",
      display: '15.6" FHD 144Hz IPS',
      os: "Windows 11",
      weight: "2.2kg"
    }
  },
  {
    name: "Lenovo Legion 5 15ARH7 Ryzen 7 RTX 3060",
    slug: "lenovo-legion-5-15arh7-ryzen7-rtx3060",
    categorySlug: "laptop",
    brand: "Lenovo",
    price: 28990000,
    oldPrice: 30990000,
    sku: "LAP-LENOVO-LEGION5-R7",
    shortDescription:
      "Legion 5 gaming cho streamer, R7, RTX 3060, màn 165Hz màu đẹp.",
    description:
      "Lenovo Legion 5 15ARH7 thiết kế tối giản, cấu hình Ryzen 7, RTX 3060, màn IPS 165Hz, phù hợp vừa chơi game vừa livestream.",
    tags: ["laptop", "gaming", "lenovo", "legion"],
    specs: {
      cpu: "AMD Ryzen 7 6800H",
      ram: "16GB DDR5",
      storage: "1TB SSD NVMe",
      gpu: "NVIDIA GeForce RTX 3060 6GB",
      display: '15.6" QHD 165Hz IPS',
      os: "Windows 11",
      weight: "2.4kg"
    }
  },
  {
    name: "Dell Inspiron 15 3520 i5 Office",
    slug: "dell-inspiron-15-3520-i5-office",
    categorySlug: "laptop",
    brand: "Dell",
    price: 16990000,
    oldPrice: 18990000,
    sku: "LAP-DELL-INSP15-3520",
    shortDescription:
      "Laptop văn phòng Dell bền bỉ, phù hợp sinh viên và nhân viên.",
    description:
      "Dell Inspiron 15 3520 với CPU Intel Core i5 gen 12, RAM 8GB, SSD 512GB, thiết kế đơn giản, pin ổn, đáp ứng tốt nhu cầu học tập và làm việc.",
    tags: ["laptop", "office", "dell"],
    specs: {
      cpu: "Intel Core i5-1235U",
      ram: "8GB DDR4",
      storage: "512GB SSD",
      gpu: "Intel Iris Xe Graphics",
      display: '15.6" FHD',
      os: "Windows 11",
      weight: "1.68kg"
    }
  },
  {
    name: "ASUS Vivobook 14 OLED i5",
    slug: "asus-vivobook-14-oled-i5",
    categorySlug: "laptop",
    brand: "ASUS",
    price: 18990000,
    oldPrice: 20990000,
    sku: "LAP-ASUS-VIV14-OLED",
    shortDescription:
      "Vivobook màn OLED đẹp, phù hợp design nhẹ và giải trí.",
    description:
      "ASUS Vivobook 14 OLED màn hình OLED 2.8K, viền mỏng, CPU i5 12th, thiết kế trẻ trung, phù hợp dân văn phòng và creator nhẹ.",
    tags: ["laptop", "vivobook", "oled"],
    specs: {
      cpu: "Intel Core i5-1240P",
      ram: "16GB LPDDR4X",
      storage: "512GB SSD NVMe",
      gpu: "Intel Iris Xe",
      display: '14" 2.8K OLED 90Hz',
      os: "Windows 11",
      weight: "1.4kg"
    }
  },
  {
    name: "HP Pavilion 15 i5 Học tập",
    slug: "hp-pavilion-15-i5-hoc-tap",
    categorySlug: "laptop",
    brand: "HP",
    price: 15990000,
    oldPrice: 17990000,
    sku: "LAP-HP-PAV15-I5",
    shortDescription:
      "Pavilion 15 mỏng nhẹ, thích hợp sinh viên và dân văn phòng.",
    description:
      "HP Pavilion 15 sở hữu thiết kế trẻ trung, CPU i5, RAM 8GB, SSD 512GB, đủ đáp ứng học tập, làm báo cáo, thuyết trình và giải trí.",
    tags: ["laptop", "office", "hp"],
    specs: {
      cpu: "Intel Core i5-1235U",
      ram: "8GB DDR4",
      storage: "512GB SSD",
      gpu: "Intel Iris Xe",
      display: '15.6" FHD IPS',
      os: "Windows 11",
      weight: "1.75kg"
    }
  },
  {
    name: "MacBook Air M1 256GB",
    slug: "macbook-air-m1-256gb",
    categorySlug: "laptop",
    brand: "Apple",
    price: 22990000,
    oldPrice: 25990000,
    sku: "LAP-APPLE-MBA-M1-256",
    shortDescription:
      "MacBook Air M1 nhẹ, pin trâu, tối ưu cho hệ sinh thái Apple.",
    description:
      "MacBook Air M1 với chip Apple M1, màn Retina, pin lâu, phù hợp lập trình web, văn phòng, học online và làm nội dung nhẹ.",
    tags: ["laptop", "macbook", "apple"],
    specs: {
      cpu: "Apple M1 8-core",
      ram: "8GB Unified",
      storage: "256GB SSD",
      gpu: "7-core GPU",
      display: '13.3" Retina',
      os: "macOS",
      weight: "1.29kg"
    }
  },
  {
    name: "Gigabyte G5 i5 RTX 4060",
    slug: "gigabyte-g5-i5-rtx-4060",
    categorySlug: "laptop",
    brand: "Gigabyte",
    price: 30990000,
    oldPrice: 32990000,
    sku: "LAP-GIGA-G5-4060",
    shortDescription:
      "Laptop gaming RTX 4060 cho game nặng và render cơ bản.",
    description:
      "Gigabyte G5 dùng CPU Intel Core i5 H, GPU RTX 4060, RAM 16GB, phù hợp gaming AAA và render video tầm trung.",
    tags: ["laptop", "gaming", "rtx4060"],
    specs: {
      cpu: "Intel Core i5-12500H",
      ram: "16GB DDR4",
      storage: "512GB SSD NVMe",
      gpu: "NVIDIA GeForce RTX 4060 8GB",
      display: '15.6" FHD 144Hz',
      os: "Windows 11",
      weight: "2.1kg"
    }
  },
  {
    name: "ASUS ROG Strix G15 Ryzen 7 RTX 3070",
    slug: "asus-rog-strix-g15-ryzen7-rtx3070",
    categorySlug: "laptop",
    brand: "ASUS",
    price: 34990000,
    oldPrice: 37990000,
    sku: "LAP-ASUS-ROG-G15",
    shortDescription:
      "ROG Strix G15 RGB hầm hố cho game thủ hardcore.",
    description:
      "ASUS ROG Strix G15 có dải LED RGB, CPU Ryzen 7, RTX 3070, RAM 16GB, màn 300Hz cho game FPS cạnh tranh.",
    tags: ["laptop", "rog", "gaming"],
    specs: {
      cpu: "AMD Ryzen 7 6800H",
      ram: "16GB DDR5",
      storage: "1TB SSD",
      gpu: "NVIDIA GeForce RTX 3070 8GB",
      display: '15.6" FHD 300Hz',
      os: "Windows 11",
      weight: "2.3kg"
    }
  },
  {
    name: "Lenovo IdeaPad 3 i3 Văn phòng",
    slug: "lenovo-ideapad-3-i3-van-phong",
    categorySlug: "laptop",
    brand: "Lenovo",
    price: 10990000,
    oldPrice: 12990000,
    sku: "LAP-LENOVO-IP3-I3",
    shortDescription:
      "IdeaPad 3 giá mềm, phù hợp học online và làm việc nhẹ.",
    description:
      "Lenovo IdeaPad 3 cấu hình i3, RAM 8GB, SSD 256GB, màn 15.6 inch, thích hợp tác vụ văn phòng cơ bản.",
    tags: ["laptop", "office", "budget"],
    specs: {
      cpu: "Intel Core i3-1115G4",
      ram: "8GB DDR4",
      storage: "256GB SSD",
      gpu: "Intel UHD Graphics",
      display: '15.6" FHD',
      os: "Windows 11",
      weight: "1.7kg"
    }
  }
].map((p) => ({ ...baseFields, ...p }));

/* ========== MÀN HÌNH (10) ========== */
const monitors = [
  {
    name: 'ASUS TUF Gaming VG249Q 24" 144Hz',
    slug: "asus-tuf-gaming-vg249q-24-144hz",
    categorySlug: "man-hinh",
    brand: "ASUS",
    price: 4990000,
    oldPrice: 5490000,
    sku: "MON-ASUS-VG249Q",
    shortDescription: "Màn IPS 24 inch 144Hz cho game thủ FPS.",
    description:
      "ASUS TUF VG249Q là màn IPS 24 inch, FHD, tần số quét 144Hz, hỗ trợ Adaptive-Sync, thích hợp game FPS.",
    tags: ["monitor", "gaming", "144hz"],
    specs: {
      size: '24"',
      resolution: "1920x1080",
      panel: "IPS",
      refreshRate: "144Hz",
      responseTime: "1ms MPRT",
      ports: "HDMI, DisplayPort"
    }
  },
  {
    name: 'LG UltraGear 27GN750 27" 240Hz',
    slug: "lg-ultragear-27gn750-27-240hz",
    categorySlug: "man-hinh",
    brand: "LG",
    price: 7990000,
    oldPrice: 8990000,
    sku: "MON-LG-27GN750",
    shortDescription: "Màn hình 27 inch 240Hz cho eSports.",
    description:
      "LG UltraGear 27GN750 với tần số quét 240Hz, thời gian đáp ứng 1ms, phù hợp game thủ cạnh tranh cao.",
    tags: ["monitor", "gaming", "240hz"],
    specs: {
      size: '27"',
      resolution: "1920x1080",
      panel: "IPS",
      refreshRate: "240Hz",
      responseTime: "1ms GTG",
      ports: "HDMI, DisplayPort, USB"
    }
  },
  {
    name: 'Gigabyte G27Q 27" 2K 144Hz',
    slug: "gigabyte-g27q-27-2k-144hz",
    categorySlug: "man-hinh",
    brand: "Gigabyte",
    price: 6990000,
    oldPrice: 7690000,
    sku: "MON-GIGA-G27Q",
    shortDescription: "Màn 2K 144Hz, màu đẹp cho gaming & đồ họa.",
    description:
      "Gigabyte G27Q có độ phân giải 2K, 144Hz, tấm nền IPS, gam màu rộng, phù hợp vừa chơi game vừa chỉnh sửa ảnh.",
    tags: ["monitor", "2k", "144hz"],
    specs: {
      size: '27"',
      resolution: "2560x1440",
      panel: "IPS",
      refreshRate: "144Hz",
      responseTime: "1ms",
      ports: "HDMI, DisplayPort"
    }
  },
  {
    name: 'Samsung Odyssey G3 24" 144Hz',
    slug: "samsung-odyssey-g3-24-144hz",
    categorySlug: "man-hinh",
    brand: "Samsung",
    price: 4490000,
    oldPrice: 4990000,
    sku: "MON-SAM-G3-24",
    shortDescription: "Màn VA 144Hz giá tốt cho game.",
    description:
      "Samsung Odyssey G3 dùng tấm nền VA, tần số quét 144Hz, thiết kế viền mỏng, phù hợp game FPS giá mềm.",
    tags: ["monitor", "gaming"],
    specs: {
      size: '24"',
      resolution: "1920x1080",
      panel: "VA",
      refreshRate: "144Hz",
      responseTime: "1ms MPRT",
      ports: "HDMI, DisplayPort"
    }
  },
  {
    name: 'AOC 24G2E 24" 144Hz',
    slug: "aoc-24g2e-24-144hz",
    categorySlug: "man-hinh",
    brand: "AOC",
    price: 3990000,
    oldPrice: 4490000,
    sku: "MON-AOC-24G2E",
    shortDescription: "Màn IPS 144Hz ngon-bổ-rẻ.",
    description:
      "AOC 24G2E là một trong những màn 144Hz giá tốt, màu sắc ổn, phù hợp học tập và giải trí.",
    tags: ["monitor", "budget", "144hz"],
    specs: {
      size: '24"',
      resolution: "1920x1080",
      panel: "IPS",
      refreshRate: "144Hz",
      responseTime: "1ms",
      ports: "HDMI, DisplayPort"
    }
  },
  {
    name: 'Dell P2419H 24" IPS Văn phòng',
    slug: "dell-p2419h-24-ips-van-phong",
    categorySlug: "man-hinh",
    brand: "Dell",
    price: 4290000,
    oldPrice: 4590000,
    sku: "MON-DELL-P2419H",
    shortDescription: "Màn IPS 24 inch cho văn phòng.",
    description:
      "Dell P2419H có chân đế linh hoạt, tấm nền IPS, phù hợp setup bàn làm việc gọn gàng.",
    tags: ["monitor", "office"],
    specs: {
      size: '24"',
      resolution: "1920x1080",
      panel: "IPS",
      refreshRate: "60Hz",
      responseTime: "5ms",
      ports: "HDMI, DisplayPort, VGA"
    }
  },
  {
    name: 'LG 29UM69G 29" UltraWide 75Hz',
    slug: "lg-29um69g-29-ultrawide-75hz",
    categorySlug: "man-hinh",
    brand: "LG",
    price: 5990000,
    oldPrice: 6490000,
    sku: "MON-LG-29UM69G",
    shortDescription: "Màn hình UltraWide 21:9 cho đa nhiệm.",
    description:
      "LG 29UM69G rộng 29 inch, tỉ lệ 21:9, phù hợp vừa làm việc vừa xem timeline video.",
    tags: ["monitor", "ultrawide"],
    specs: {
      size: '29"',
      resolution: "2560x1080",
      panel: "IPS",
      refreshRate: "75Hz",
      responseTime: "5ms",
      ports: "HDMI, DisplayPort, USB-C"
    }
  },
  {
    name: 'ViewSonic VA2732 27" IPS Văn phòng',
    slug: "viewsonic-va2732-27-ips-van-phong",
    categorySlug: "man-hinh",
    brand: "ViewSonic",
    price: 3890000,
    oldPrice: 4290000,
    sku: "MON-VS-VA2732",
    shortDescription: "Màn 27 inch IPS giá mềm.",
    description:
      "ViewSonic VA2732 kích thước 27 inch, IPS, chân đế đơn giản, phù hợp học online.",
    tags: ["monitor", "office"],
    specs: {
      size: '27"',
      resolution: "1920x1080",
      panel: "IPS",
      refreshRate: "75Hz",
      responseTime: "4ms",
      ports: "HDMI, VGA"
    }
  },
  {
    name: 'BenQ EX2510 25" 144Hz',
    slug: "benq-ex2510-25-144hz",
    categorySlug: "man-hinh",
    brand: "BenQ",
    price: 6290000,
    oldPrice: 6990000,
    sku: "MON-BENQ-EX2510",
    shortDescription: "Màn gaming 25 inch với HDRi.",
    description:
      "BenQ EX2510 hỗ trợ HDRi, loa tích hợp, thích hợp gaming và giải trí.",
    tags: ["monitor", "gaming"],
    specs: {
      size: '25"',
      resolution: "1920x1080",
      panel: "IPS",
      refreshRate: "144Hz",
      responseTime: "1ms",
      ports: "HDMI, DisplayPort"
    }
  },
  {
    name: 'MSI Optix G271 27" 144Hz',
    slug: "msi-optix-g271-27-144hz",
    categorySlug: "man-hinh",
    brand: "MSI",
    price: 5790000,
    oldPrice: 6290000,
    sku: "MON-MSI-G271",
    shortDescription: "Màn MSI gaming 27 inch 144Hz.",
    description:
      "MSI Optix G271 dùng tấm nền IPS, 144Hz, viền mỏng, phù hợp setup PC gaming MSI.",
    tags: ["monitor", "gaming"],
    specs: {
      size: '27"',
      resolution: "1920x1080",
      panel: "IPS",
      refreshRate: "144Hz",
      responseTime: "1ms MPRT",
      ports: "HDMI, DisplayPort"
    }
  }
].map((p) => ({ ...baseFields, ...p }));

/* ========== BÀN PHÍM (10) ========== */
const keyboards = [
  {
    name: "AKKO 3068B Plus Wireless RGB",
    slug: "akko-3068b-plus-wireless-rgb",
    categorySlug: "ban-phim",
    brand: "AKKO",
    price: 1890000,
    oldPrice: 2090000,
    sku: "KB-AKKO-3068B",
    shortDescription: "Bàn phím cơ 68 phím, wireless, RGB.",
    description:
      "AKKO 3068B Plus layout gọn, hỗ trợ Bluetooth/2.4G, keycap PBT, switch mượt, phù hợp setup gọn gàng.",
    tags: ["ban-phim-co", "akko"],
    specs: {
      layout: "68 phím",
      switch: "Akko CS Jelly Pink",
      keycap: "PBT Double-shot",
      connection: "Bluetooth, 2.4G, Wired",
      led: "RGB"
    }
  },
  {
    name: "AKKO 3087 RGB Black",
    slug: "akko-3087-rgb-black",
    categorySlug: "ban-phim",
    brand: "AKKO",
    price: 1490000,
    oldPrice: 1690000,
    sku: "KB-AKKO-3087",
    shortDescription: "Bàn phím cơ 87 phím, dây, LED RGB.",
    description:
      "AKKO 3087 là bàn phím TKL 87 phím, keycap PBT, switch bền, phù hợp game thủ và dân văn phòng.",
    tags: ["ban-phim-co", "tkl"],
    specs: {
      layout: "87 phím",
      switch: "Akko CS Ocean Blue",
      keycap: "PBT Dye-sub",
      connection: "Wired USB-C",
      led: "RGB"
    }
  },
  {
    name: "DareU EK87 RGB Brown Switch",
    slug: "dareu-ek87-rgb-brown-switch",
    categorySlug: "ban-phim",
    brand: "DareU",
    price: 690000,
    oldPrice: 890000,
    sku: "KB-DAREU-EK87",
    shortDescription: "Bàn phím cơ giá rẻ, TKL, switch Brown.",
    description:
      "DareU EK87 thiết kế đơn giản, có kê tay, phù hợp người mới chơi phím cơ.",
    tags: ["ban-phim-co", "budget"],
    specs: {
      layout: "87 phím",
      switch: "DareU Brown",
      keycap: "ABS",
      connection: "Wired USB",
      led: "Rainbow"
    }
  },
  {
    name: "Keychron K2 V2 Wireless",
    slug: "keychron-k2-v2-wireless",
    categorySlug: "ban-phim",
    brand: "Keychron",
    price: 1990000,
    oldPrice: 2290000,
    sku: "KB-KEYCHRON-K2",
    shortDescription: "Bàn phím cơ 75%, hỗ trợ Mac/Windows.",
    description:
      "Keychron K2 V2 75% nhỏ gọn, hỗ trợ đa hệ điều hành, pin tốt, phù hợp người dùng laptop.",
    tags: ["ban-phim-co", "wireless"],
    specs: {
      layout: "75%",
      switch: "Gateron G Pro Red",
      keycap: "ABS",
      connection: "Bluetooth, Wired",
      led: "White backlight"
    }
  },
  {
    name: "Logitech G512 Carbon GX Blue",
    slug: "logitech-g512-carbon-gx-blue",
    categorySlug: "ban-phim",
    brand: "Logitech",
    price: 2290000,
    oldPrice: 2590000,
    sku: "KB-LOGI-G512",
    shortDescription: "Bàn phím cơ fullsize, khung nhôm.",
    description:
      "Logitech G512 Carbon với switch GX Blue clicky, khung nhôm chắc chắn, phù hợp game thủ thích cảm giác gõ rõ ràng.",
    tags: ["ban-phim-co", "logitech"],
    specs: {
      layout: "104 phím",
      switch: "Logitech GX Blue",
      keycap: "ABS",
      connection: "Wired USB",
      led: "RGB Lightsync"
    }
  },
  {
    name: "Razer Huntsman Mini 60%",
    slug: "razer-huntsman-mini-60",
    categorySlug: "ban-phim",
    brand: "Razer",
    price: 2590000,
    oldPrice: 2890000,
    sku: "KB-RAZER-HUNTSMAN-MINI",
    shortDescription: "Bàn phím 60% optical switch, nhỏ gọn.",
    description:
      "Razer Huntsman Mini siêu gọn, dùng optical switch cho tốc độ phản hồi rất nhanh, phù hợp bàn nhỏ.",
    tags: ["ban-phim-co", "razer", "60%"],
    specs: {
      layout: "60%",
      switch: "Razer Optical Red",
      keycap: "PBT Double-shot",
      connection: "Wired USB-C",
      led: "RGB Chroma"
    }
  },
  {
    name: "Corsair K70 RGB MK.2",
    slug: "corsair-k70-rgb-mk2",
    categorySlug: "ban-phim",
    brand: "Corsair",
    price: 2990000,
    oldPrice: 3290000,
    sku: "KB-CORSAIR-K70",
    shortDescription: "Fullsize, switch Cherry MX, RGB mạnh.",
    description:
      "Corsair K70 MK.2 với switch Cherry MX, bộ nhớ on-board, phím media riêng, phù hợp game thủ cao cấp.",
    tags: ["ban-phim-co", "corsair"],
    specs: {
      layout: "104 phím",
      switch: "Cherry MX Red",
      keycap: "ABS",
      connection: "Wired USB passthrough",
      led: "RGB"
    }
  },
  {
    name: "Varmilo VA87M Sakura",
    slug: "varmilo-va87m-sakura",
    categorySlug: "ban-phim",
    brand: "Varmilo",
    price: 3290000,
    oldPrice: 3590000,
    sku: "KB-VAR-VA87M-SAKURA",
    shortDescription: "Bàn phím TKL, keycap in theme Sakura.",
    description:
      "Varmilo VA87M nổi tiếng về độ hoàn thiện, theme Sakura đẹp, switch mượt, thích hợp sưu tầm.",
    tags: ["ban-phim-co", "varmilo"],
    specs: {
      layout: "87 phím",
      switch: "Cherry MX Brown",
      keycap: "PBT Dye-sub",
      connection: "Wired USB",
      led: "Không LED"
    }
  },
  {
    name: "AKKO 3108S Black Pink",
    slug: "akko-3108s-black-pink",
    categorySlug: "ban-phim",
    brand: "AKKO",
    price: 1590000,
    oldPrice: 1790000,
    sku: "KB-AKKO-3108S",
    shortDescription: "Fullsize, theme hồng-đen, LED trắng.",
    description:
      "AKKO 3108S Black Pink đẹp mắt, phù hợp setup nữ game thủ hoặc người thích màu hồng.",
    tags: ["ban-phim-co", "fullsize"],
    specs: {
      layout: "104 phím",
      switch: "Akko CS Jelly Pink",
      keycap: "PBT",
      connection: "Wired USB",
      led: "White LED"
    }
  },
  {
    name: "DareU EK128 Wireless",
    slug: "dareu-ek128-wireless",
    categorySlug: "ban-phim",
    brand: "DareU",
    price: 990000,
    oldPrice: 1190000,
    sku: "KB-DAREU-EK128",
    shortDescription: "Wireless, layout đầy đủ, giá mềm.",
    description:
      "DareU EK128 hỗ trợ 2.4G không dây, pin ổn, phù hợp bàn làm việc gọn gàng.",
    tags: ["ban-phim-co", "wireless", "budget"],
    specs: {
      layout: "104 phím",
      switch: "DareU Red",
      keycap: "ABS",
      connection: "2.4G Wireless",
      led: "Rainbow"
    }
  }
].map((p) => ({ ...baseFields, ...p }));

/* ========== CHUỘT (10) ========== */
const mice = [
  {
    name: "Logitech G102 Lightsync",
    slug: "logitech-g102-lightsync",
    categorySlug: "chuot",
    brand: "Logitech",
    price: 390000,
    oldPrice: 490000,
    sku: "MOU-LOGI-G102",
    shortDescription: "Chuột gaming quốc dân, DPI cao, RGB.",
    description:
      "Logitech G102 nhỏ gọn, cảm biến ổn định, phù hợp cả học tập lẫn chơi game.",
    tags: ["mouse", "logitech"],
    specs: {
      dpi: "8000 DPI",
      connection: "Wired USB",
      buttons: 6,
      weight: "85g"
    }
  },
  {
    name: "Logitech G304 Lightspeed Wireless",
    slug: "logitech-g304-lightspeed-wireless",
    categorySlug: "chuot",
    brand: "Logitech",
    price: 690000,
    oldPrice: 890000,
    sku: "MOU-LOGI-G304",
    shortDescription: "Chuột wireless gaming pin trâu.",
    description:
      "Logitech G304 dùng công nghệ Lightspeed, thời lượng pin dài, thích hợp game FPS.",
    tags: ["mouse", "wireless", "logitech"],
    specs: {
      dpi: "12000 DPI",
      connection: "2.4G Wireless",
      buttons: 6,
      weight: "99g"
    }
  },
  {
    name: "Razer DeathAdder Essential",
    slug: "razer-deathadder-essential",
    categorySlug: "chuot",
    brand: "Razer",
    price: 490000,
    oldPrice: 690000,
    sku: "MOU-RAZER-DA-ESS",
    shortDescription: "Chuột gaming huyền thoại, form to ôm tay.",
    description:
      "Razer DeathAdder Essential form công thái học, bền, phù hợp game MOBA/FPS.",
    tags: ["mouse", "razer"],
    specs: {
      dpi: "6400 DPI",
      connection: "Wired USB",
      buttons: 5,
      weight: "96g"
    }
  },
  {
    name: "Razer Viper Mini",
    slug: "razer-viper-mini",
    categorySlug: "chuot",
    brand: "Razer",
    price: 790000,
    oldPrice: 990000,
    sku: "MOU-RAZER-VIPER-MINI",
    shortDescription: "Chuột gaming nhẹ, phù hợp tay nhỏ.",
    description:
      "Razer Viper Mini nặng ~61g, sensor tốt, dây mềm, phù hợp game thủ FPS.",
    tags: ["mouse", "razer", "lightweight"],
    specs: {
      dpi: "8500 DPI",
      connection: "Wired USB",
      buttons: 6,
      weight: "61g"
    }
  },
  {
    name: "Glorious Model O",
    slug: "glorious-model-o",
    categorySlug: "chuot",
    brand: "Glorious",
    price: 1390000,
    oldPrice: 1590000,
    sku: "MOU-GLORIOUS-MODEL-O",
    shortDescription: "Chuột siêu nhẹ, vỏ tổ ong.",
    description:
      "Glorious Model O với thiết kế honeycomb, sensor cao cấp, phù hợp FPS competitive.",
    tags: ["mouse", "lightweight"],
    specs: {
      dpi: "12000 DPI",
      connection: "Wired USB",
      buttons: 6,
      weight: "67g"
    }
  },
  {
    name: "Corsair Harpoon RGB Pro",
    slug: "corsair-harpoon-rgb-pro",
    categorySlug: "chuot",
    brand: "Corsair",
    price: 590000,
    oldPrice: 790000,
    sku: "MOU-CORSAIR-HARPOON",
    shortDescription: "Chuột gaming nhỏ gọn, RGB.",
    description:
      "Corsair Harpoon nhẹ, grip tốt, phù hợp game thủ tay vừa và nhỏ.",
    tags: ["mouse", "corsair"],
    specs: {
      dpi: "12000 DPI",
      connection: "Wired USB",
      buttons: 6,
      weight: "85g"
    }
  },
  {
    name: "SteelSeries Rival 3",
    slug: "steelseries-rival-3",
    categorySlug: "chuot",
    brand: "SteelSeries",
    price: 690000,
    oldPrice: 890000,
    sku: "MOU-SS-RIVAL3",
    shortDescription: "Chuột gaming cảm biến TrueMove.",
    description:
      "SteelSeries Rival 3 dùng cảm biến TrueMove, độ bền cao, phù hợp eSports.",
    tags: ["mouse", "steelseries"],
    specs: {
      dpi: "8500 DPI",
      connection: "Wired USB",
      buttons: 6,
      weight: "77g"
    }
  },
  {
    name: "Xtrfy M4 RGB",
    slug: "xtrfy-m4-rgb",
    categorySlug: "chuot",
    brand: "Xtrfy",
    price: 1390000,
    oldPrice: 1590000,
    sku: "MOU-XTRFY-M4",
    shortDescription: "Chuột siêu nhẹ, form công thái học.",
    description:
      "Xtrfy M4 vỏ tổ ong, dây mềm, chú trọng hiệu năng cho game thủ.",
    tags: ["mouse", "lightweight"],
    specs: {
      dpi: "16000 DPI",
      connection: "Wired USB",
      buttons: 6,
      weight: "69g"
    }
  },
  {
    name: "Logitech MX Master 3S",
    slug: "logitech-mx-master-3s",
    categorySlug: "chuot",
    brand: "Logitech",
    price: 2490000,
    oldPrice: 2690000,
    sku: "MOU-LOGI-MX-MASTER-3S",
    shortDescription: "Chuột productivity cao cấp.",
    description:
      "MX Master 3S nhiều nút, cuộn ngang, thích hợp coder, designer, văn phòng cao cấp.",
    tags: ["mouse", "office"],
    specs: {
      dpi: "8000 DPI",
      connection: "Bluetooth, Logi Bolt",
      buttons: 7,
      weight: "141g"
    }
  },
  {
    name: "Logitech M331 Silent",
    slug: "logitech-m331-silent",
    categorySlug: "chuot",
    brand: "Logitech",
    price: 350000,
    oldPrice: 450000,
    sku: "MOU-LOGI-M331",
    shortDescription: "Chuột không dây, click êm.",
    description:
      "Logitech M331 nhỏ gọn, click êm, phù hợp môi trường văn phòng, thư viện.",
    tags: ["mouse", "office", "silent"],
    specs: {
      dpi: "1000 DPI",
      connection: "2.4G Wireless",
      buttons: 3,
      weight: "91g"
    }
  }
].map((p) => ({ ...baseFields, ...p }));

/* ========== TAI NGHE (10) ========== */
const headsets = [
  {
    name: "HyperX Cloud II",
    slug: "hyperx-cloud-ii",
    categorySlug: "tai-nghe",
    brand: "HyperX",
    price: 1590000,
    oldPrice: 1890000,
    sku: "HS-HX-CLOUD2",
    shortDescription: "Tai nghe gaming huyền thoại, đeo êm.",
    description:
      "HyperX Cloud II có đệm tai êm, âm thanh rõ, mic tốt, phù hợp chơi game lâu.",
    tags: ["headset", "gaming"],
    specs: {
      driver: "53mm",
      connection: "USB / 3.5mm",
      surround: "7.1",
      weight: "320g"
    }
  },
  {
    name: "HyperX Cloud Alpha",
    slug: "hyperx-cloud-alpha",
    categorySlug: "tai-nghe",
    brand: "HyperX",
    price: 1990000,
    oldPrice: 2190000,
    sku: "HS-HX-CLOUD-ALPHA",
    shortDescription: "Âm bass khỏe, build chắc chắn.",
    description:
      "Cloud Alpha dùng buồng âm kép, tách bass rõ, phù hợp game và nghe nhạc.",
    tags: ["headset", "gaming"],
    specs: {
      driver: "50mm",
      connection: "3.5mm",
      surround: "Stereo",
      weight: "298g"
    }
  },
  {
    name: "SteelSeries Arctis 3",
    slug: "steelseries-arctis-3",
    categorySlug: "tai-nghe",
    brand: "SteelSeries",
    price: 1490000,
    oldPrice: 1690000,
    sku: "HS-SS-ARCTIS3",
    shortDescription: "Headband vải co giãn, đeo thoải mái.",
    description:
      "Arctis 3 có micro ClearCast, phù hợp chơi game trên PC, Console, Mobile.",
    tags: ["headset", "gaming"],
    specs: {
      driver: "40mm",
      connection: "3.5mm",
      surround: "Stereo",
      weight: "295g"
    }
  },
  {
    name: "Razer BlackShark V2 X",
    slug: "razer-blackshark-v2-x",
    categorySlug: "tai-nghe",
    brand: "Razer",
    price: 1190000,
    oldPrice: 1390000,
    sku: "HS-RAZER-BSV2X",
    shortDescription: "Tai nghe nhẹ, cách âm tốt.",
    description:
      "BlackShark V2 X với earcup dày, phù hợp streamer cần cách âm.",
    tags: ["headset", "gaming"],
    specs: {
      driver: "50mm",
      connection: "3.5mm",
      surround: "7.1 (software)",
      weight: "240g"
    }
  },
  {
    name: "Corsair HS50 Pro",
    slug: "corsair-hs50-pro",
    categorySlug: "tai-nghe",
    brand: "Corsair",
    price: 1090000,
    oldPrice: 1290000,
    sku: "HS-CORSAIR-HS50",
    shortDescription: "Build kim loại chắc, mic rời.",
    description:
      "Corsair HS50 Pro thích hợp game thủ muốn tai nghe bền, dễ phối gear.",
    tags: ["headset", "gaming"],
    specs: {
      driver: "50mm",
      connection: "3.5mm",
      surround: "Stereo",
      weight: "322g"
    }
  },
  {
    name: "Logitech G433",
    slug: "logitech-g433",
    categorySlug: "tai-nghe",
    brand: "Logitech",
    price: 1490000,
    oldPrice: 1690000,
    sku: "HS-LOGI-G433",
    shortDescription: "Tai nghe vải, nhẹ, đa nền tảng.",
    description:
      "Logitech G433 có earcup bằng vải, đeo thoáng, thích hợp nhiều giờ liền.",
    tags: ["headset", "gaming"],
    specs: {
      driver: "40mm",
      connection: "3.5mm / USB",
      surround: "7.1 (PC)",
      weight: "259g"
    }
  },
  {
    name: "Sony WH-CH510 Wireless",
    slug: "sony-wh-ch510-wireless",
    categorySlug: "tai-nghe",
    brand: "Sony",
    price: 1190000,
    oldPrice: 1390000,
    sku: "HS-SONY-CH510",
    shortDescription: "Tai nghe không dây giá tốt, pin trâu.",
    description:
      "WH-CH510 pin tới 35 giờ, kết nối Bluetooth ổn định, phù hợp nghe nhạc, học online.",
    tags: ["headset", "wireless", "sony"],
    specs: {
      driver: "30mm",
      connection: "Bluetooth",
      surround: "Stereo",
      weight: "132g"
    }
  },
  {
    name: "Sony WH-1000XM4",
    slug: "sony-wh-1000xm4",
    categorySlug: "tai-nghe",
    brand: "Sony",
    price: 5490000,
    oldPrice: 5990000,
    sku: "HS-SONY-XM4",
    shortDescription: "Chống ồn chủ động cao cấp.",
    description:
      "WH-1000XM4 là một trong những tai nghe chống ồn tốt nhất, phù hợp di chuyển và làm việc.",
    tags: ["headset", "anc", "sony"],
    specs: {
      driver: "40mm",
      connection: "Bluetooth, NFC",
      surround: "Stereo",
      weight: "254g"
    }
  },
  {
    name: "JBL Quantum 400",
    slug: "jbl-quantum-400",
    categorySlug: "tai-nghe",
    brand: "JBL",
    price: 1590000,
    oldPrice: 1790000,
    sku: "HS-JBL-QUANTUM400",
    shortDescription: "Tai nghe gaming âm trầm tốt.",
    description:
      "JBL Quantum 400 có âm trầm mạnh, đèn RGB, mic tốt cho voice chat.",
    tags: ["headset", "gaming"],
    specs: {
      driver: "50mm",
      connection: "USB / 3.5mm",
      surround: "7.1 (PC)",
      weight: "274g"
    }
  },
  {
    name: "Edifier W820NB Plus",
    slug: "edifier-w820nb-plus",
    categorySlug: "tai-nghe",
    brand: "Edifier",
    price: 1590000,
    oldPrice: 1790000,
    sku: "HS-EDIFIER-W820NB",
    shortDescription: "Wireless ANC, âm thanh cân bằng.",
    description:
      "W820NB Plus có chống ồn chủ động, pin tốt, phù hợp đi làm, đi học.",
    tags: ["headset", "wireless"],
    specs: {
      driver: "40mm",
      connection: "Bluetooth",
      surround: "Stereo",
      weight: "220g"
    }
  }
].map((p) => ({ ...baseFields, ...p }));

/* ========== LOA (10) ========== */
const speakers = [
  {
    name: "Microlab B51 USB Mini",
    slug: "microlab-b51-usb-mini",
    categorySlug: "loa",
    brand: "Microlab",
    price: 250000,
    oldPrice: 320000,
    sku: "SPK-MICRO-B51",
    shortDescription: "Loa mini gắn màn hình, dùng nguồn USB.",
    description:
      "Microlab B51 nhỏ gọn, dễ mang theo, phù hợp bàn học, văn phòng.",
    tags: ["loa", "mini"],
    specs: {
      power: "4W",
      channels: "2.0",
      connection: "USB + 3.5mm"
    }
  },
  {
    name: "Microlab M108 2.1",
    slug: "microlab-m108-2-1",
    categorySlug: "loa",
    brand: "Microlab",
    price: 450000,
    oldPrice: 520000,
    sku: "SPK-MICRO-M108",
    shortDescription: "Loa 2.1 có sub, giá rẻ.",
    description:
      "Microlab M108 gồm 2 loa vệ tinh và 1 sub, phù hợp nghe nhạc, xem phim.",
    tags: ["loa", "2.1"],
    specs: {
      power: "11W",
      channels: "2.1",
      connection: "3.5mm"
    }
  },
  {
    name: "SoundMax A920 2.1",
    slug: "soundmax-a920-2-1",
    categorySlug: "loa",
    brand: "SoundMax",
    price: 690000,
    oldPrice: 790000,
    sku: "SPK-SMAX-A920",
    shortDescription: "Loa 2.1 công suất lớn, bass mạnh.",
    description:
      "SoundMax A920 phù hợp phòng trọ, nghe nhạc EDM, xem phim.",
    tags: ["loa", "2.1"],
    specs: {
      power: "35W",
      channels: "2.1",
      connection: "3.5mm / RCA"
    }
  },
  {
    name: "Edifier R1280DB",
    slug: "edifier-r1280db",
    categorySlug: "loa",
    brand: "Edifier",
    price: 2290000,
    oldPrice: 2490000,
    sku: "SPK-EDIFIER-R1280DB",
    shortDescription: "Loa bookshelf, kết nối đa dạng.",
    description:
      "R1280DB cho âm cân bằng, có Bluetooth, optical, phù hợp bàn làm việc.",
    tags: ["loa", "bookshelf"],
    specs: {
      power: "42W",
      channels: "2.0",
      connection: "Bluetooth, Optical, RCA"
    }
  },
  {
    name: "Edifier R1700BT",
    slug: "edifier-r1700bt",
    categorySlug: "loa",
    brand: "Edifier",
    price: 2690000,
    oldPrice: 2890000,
    sku: "SPK-EDIFIER-R1700BT",
    shortDescription: "Bookshelf có Bluetooth, bass sâu.",
    description:
      "R1700BT có tiếng ấm, phù hợp nghe nhạc, xem phim trong phòng vừa.",
    tags: ["loa", "bookshelf"],
    specs: {
      power: "66W",
      channels: "2.0",
      connection: "Bluetooth, RCA"
    }
  },
  {
    name: "Logitech Z213 2.1",
    slug: "logitech-z213-2-1",
    categorySlug: "loa",
    brand: "Logitech",
    price: 450000,
    oldPrice: 520000,
    sku: "SPK-LOGI-Z213",
    shortDescription: "Loa 2.1 nhỏ gọn, giá thấp.",
    description:
      "Logitech Z213 phù hợp kèm PC, tăng trải nghiệm xem YouTube, phim.",
    tags: ["loa", "2.1"],
    specs: {
      power: "14W",
      channels: "2.1",
      connection: "3.5mm"
    }
  },
  {
    name: "Logitech Z333 2.1",
    slug: "logitech-z333-2-1",
    categorySlug: "loa",
    brand: "Logitech",
    price: 899000,
    oldPrice: 990000,
    sku: "SPK-LOGI-Z333",
    shortDescription: "Loa 2.1 công suất lớn hơn, có sub.",
    description:
      "Z333 mang lại âm bass tốt, phù hợp phòng ngủ, phòng học.",
    tags: ["loa", "2.1"],
    specs: {
      power: "40W",
      channels: "2.1",
      connection: "3.5mm / RCA"
    }
  },
  {
    name: "Soundpeats P2 Portable",
    slug: "soundpeats-p2-portable",
    categorySlug: "loa",
    brand: "Soundpeats",
    price: 590000,
    oldPrice: 690000,
    sku: "SPK-SOUNDPEATS-P2",
    shortDescription: "Loa Bluetooth di động, pin tốt.",
    description:
      "Soundpeats P2 chống nước nhẹ, phù hợp mang theo du lịch, dã ngoại.",
    tags: ["loa", "bluetooth"],
    specs: {
      power: "10W",
      channels: "2.0",
      connection: "Bluetooth, AUX"
    }
  },
  {
    name: "Sony SRS-XB13",
    slug: "sony-srs-xb13",
    categorySlug: "loa",
    brand: "Sony",
    price: 1190000,
    oldPrice: 1390000,
    sku: "SPK-SONY-XB13",
    shortDescription: "Loa mini Extra Bass, chống nước.",
    description:
      "Sony XB13 nhỏ, có dây treo, chống nước IP67, bass mạnh so với kích thước.",
    tags: ["loa", "bluetooth"],
    specs: {
      power: "5W",
      channels: "1.0",
      connection: "Bluetooth, USB-C sạc"
    }
  },
  {
    name: "JBL Flip 6",
    slug: "jbl-flip-6",
    categorySlug: "loa",
    brand: "JBL",
    price: 2690000,
    oldPrice: 2890000,
    sku: "SPK-JBL-FLIP6",
    shortDescription: "Loa trụ chống nước, bass khỏe.",
    description:
      "JBL Flip 6 phù hợp party nhỏ, có thể pair nhiều loa với nhau.",
    tags: ["loa", "bluetooth"],
    specs: {
      power: "30W",
      channels: "2.0",
      connection: "Bluetooth, USB-C sạc"
    }
  }
].map((p) => ({ ...baseFields, ...p }));

/* ========== GHẾ GAMING (10) ========== */
const chairs = [
  {
    name: "Ghế Gaming E-Dra Hunter",
    slug: "ghe-gaming-e-dra-hunter",
    categorySlug: "ghe-gaming",
    brand: "E-Dra",
    price: 2790000,
    oldPrice: 3190000,
    sku: "CHAIR-EDRA-HUNTER",
    shortDescription: "Ghế gaming êm, ngả lưng thoải mái.",
    description:
      "E-Dra Hunter có khung thép, da PU, gối lưng, gối đầu, thích hợp ngồi lâu.",
    tags: ["ghe-gaming"],
    specs: {
      material: "Da PU, khung thép",
      weightLimit: "120kg",
      recline: "90°–155°"
    }
  },
  {
    name: "Ghế Gaming E-Dra Hercules EGC203",
    slug: "ghe-gaming-e-dra-hercules-egc203",
    categorySlug: "ghe-gaming",
    brand: "E-Dra",
    price: 3390000,
    oldPrice: 3690000,
    sku: "CHAIR-EDRA-HERCULES",
    shortDescription: "Khung to, chịu tải tốt cho người to.",
    description:
      "Hercules EGC203 có bệ ngồi rộng, chịu tải tốt, phù hợp game thủ cao to.",
    tags: ["ghe-gaming", "heavy-duty"],
    specs: {
      material: "Da PU, khung thép",
      weightLimit: "150kg",
      recline: "90°–155°"
    }
  },
  {
    name: "Ghế Gaming DXRacer Formula",
    slug: "ghe-gaming-dxracer-formula",
    categorySlug: "ghe-gaming",
    brand: "DXRacer",
    price: 4790000,
    oldPrice: 5290000,
    sku: "CHAIR-DXRACER-FORMULA",
    shortDescription: "Ghế gaming thương hiệu lâu đời.",
    description:
      "DXRacer Formula form ôm người, thiết kế quen thuộc với streamer.",
    tags: ["ghe-gaming"],
    specs: {
      material: "Da PU",
      weightLimit: "120kg",
      recline: "90°–135°"
    }
  },
  {
    name: "Ghế Gaming Cougar Armor One",
    slug: "ghe-gaming-cougar-armor-one",
    categorySlug: "ghe-gaming",
    brand: "Cougar",
    price: 3990000,
    oldPrice: 4290000,
    sku: "CHAIR-COUGAR-ARMOR1",
    shortDescription: "Thiết kế mạnh mẽ, màu đen-cam.",
    description:
      "Cougar Armor One có họa tiết cam đen, phù hợp phòng game màu tối.",
    tags: ["ghe-gaming"],
    specs: {
      material: "Da PVC",
      weightLimit: "120kg",
      recline: "90°–180°"
    }
  },
  {
    name: "Ghế Gaming AndaSeat Kaiser 2",
    slug: "ghe-gaming-andaseat-kaiser-2",
    categorySlug: "ghe-gaming",
    brand: "AndaSeat",
    price: 6990000,
    oldPrice: 7490000,
    sku: "CHAIR-ANDA-KAISER2",
    shortDescription: "Ghế cỡ lớn, hỗ trợ người cao to.",
    description:
      "AndaSeat Kaiser 2 phù hợp người trên 1m8, đệm dày, khung thép lớn.",
    tags: ["ghe-gaming", "heavy-duty"],
    specs: {
      material: "Da PVC, khung thép",
      weightLimit: "150kg",
      recline: "90°–160°"
    }
  },
  {
    name: "Ghế Gaming MSI MAG CH120",
    slug: "ghe-gaming-msi-mag-ch120",
    categorySlug: "ghe-gaming",
    brand: "MSI",
    price: 4490000,
    oldPrice: 4790000,
    sku: "CHAIR-MSI-CH120",
    shortDescription: "Màu đen đỏ, hợp combo MSI.",
    description:
      "MSI MAG CH120 phù hợp setup PC MSI, logo rồng đỏ nổi bật.",
    tags: ["ghe-gaming", "msi"],
    specs: {
      material: "Da PU",
      weightLimit: "150kg",
      recline: "90°–180°"
    }
  },
  {
    name: "Ghế Công Thái Học Sihoo M18",
    slug: "ghe-cong-thai-hoc-sihoo-m18",
    categorySlug: "ghe-gaming",
    brand: "Sihoo",
    price: 3290000,
    oldPrice: 3590000,
    sku: "CHAIR-SIHOO-M18",
    shortDescription: "Ghế ergonomic cho làm việc.",
    description:
      "Sihoo M18 hỗ trợ lưng tốt, phù hợp coder, designer ngồi nhiều.",
    tags: ["ergonomic", "office-chair"],
    specs: {
      material: "Lưng lưới, đệm nệm",
      weightLimit: "120kg",
      recline: "90°–125°"
    }
  },
  {
    name: "Ghế Văn Phòng Ergonomic GTChair",
    slug: "ghe-van-phong-ergonomic-gtchair",
    categorySlug: "ghe-gaming",
    brand: "GTChair",
    price: 6990000,
    oldPrice: 7490000,
    sku: "CHAIR-GT-ERGONOMIC",
    shortDescription: "Ghế ergonomic cao cấp.",
    description:
      "Ghế GTChair nhiều điểm chỉnh, phù hợp người cần bảo vệ cột sống.",
    tags: ["ergonomic", "office-chair"],
    specs: {
      material: "Lưới cao cấp",
      weightLimit: "135kg",
      recline: "90°–135°"
    }
  },
  {
    name: "Ghế Gaming Warrior WGC102",
    slug: "ghe-gaming-warrior-wgc102",
    categorySlug: "ghe-gaming",
    brand: "Warrior",
    price: 2490000,
    oldPrice: 2790000,
    sku: "CHAIR-WARRIOR-WGC102",
    shortDescription: "Giá rẻ, đủ tính năng cơ bản.",
    description:
      "Warrior WGC102 phù hợp game thủ sinh viên, ngân sách hạn chế.",
    tags: ["ghe-gaming", "budget"],
    specs: {
      material: "Da PU",
      weightLimit: "110kg",
      recline: "90°–150°"
    }
  },
  {
    name: "Ghế Gaming Xigmatek X-Seat",
    slug: "ghe-gaming-xigmatek-x-seat",
    categorySlug: "ghe-gaming",
    brand: "Xigmatek",
    price: 2690000,
    oldPrice: 2990000,
    sku: "CHAIR-XIGMA-XSEAT",
    shortDescription: "Phong cách trẻ trung, giá tốt.",
    description:
      "X-Seat là mẫu ghế gaming cơ bản, đủ gối lưng, gối đầu, dễ phối màu.",
    tags: ["ghe-gaming"],
    specs: {
      material: "Da PU",
      weightLimit: "120kg",
      recline: "90°–150°"
    }
  }
].map((p) => ({ ...baseFields, ...p }));

/* ========== TAY CẦM (10) ========== */
const controllers = [
  {
    name: "Xbox Wireless Controller Carbon Black",
    slug: "xbox-wireless-controller-carbon-black",
    categorySlug: "tay-cam",
    brand: "Xbox",
    price: 1490000,
    oldPrice: 1690000,
    sku: "PAD-XBOX-CARBON",
    shortDescription: "Tay cầm Xbox chính hãng, tương thích PC.",
    description:
      "Xbox Wireless Controller hỗ trợ Bluetooth, thiết kế quen thuộc, phù hợp game PC và console.",
    tags: ["tay-cam", "xbox"],
    specs: {
      connection: "Bluetooth / Xbox Wireless",
      vibration: "Rung phản hồi",
      compatibility: "PC, Xbox, Android"
    }
  },
  {
    name: "Sony DualSense PS5 Controller",
    slug: "sony-dualsense-ps5-controller",
    categorySlug: "tay-cam",
    brand: "Sony",
    price: 1890000,
    oldPrice: 2090000,
    sku: "PAD-SONY-DUALSENSE",
    shortDescription: "Tay cầm PS5, hỗ trợ haptic feedback.",
    description:
      "DualSense có trigger thích ứng, hỗ trợ chơi game trên PC qua Steam.",
    tags: ["tay-cam", "ps5"],
    specs: {
      connection: "USB-C / Bluetooth",
      vibration: "Haptic feedback",
      compatibility: "PS5, PC, Android"
    }
  },
  {
    name: "Gamesir T4 Pro Wireless",
    slug: "gamesir-t4-pro-wireless",
    categorySlug: "tay-cam",
    brand: "Gamesir",
    price: 890000,
    oldPrice: 1090000,
    sku: "PAD-GAMESIR-T4PRO",
    shortDescription: "Tay cầm đa nền tảng, giá tốt.",
    description:
      "Gamesir T4 Pro hỗ trợ PC, Switch, Android, iOS, có LED RGB.",
    tags: ["tay-cam", "multi-platform"],
    specs: {
      connection: "Bluetooth, 2.4G, USB",
      vibration: "Dual motor",
      compatibility: "PC, Switch, Android, iOS"
    }
  },
  {
    name: "Gamesir G7 Wired Xbox",
    slug: "gamesir-g7-wired-xbox",
    categorySlug: "tay-cam",
    brand: "Gamesir",
    price: 1190000,
    oldPrice: 1390000,
    sku: "PAD-GAMESIR-G7",
    shortDescription: "Tay cầm có dây, hỗ trợ Xbox/PC.",
    description:
      "Gamesir G7 có thể thay đổi mặt trước, phù hợp modding đơn giản.",
    tags: ["tay-cam", "xbox"],
    specs: {
      connection: "Wired USB-C",
      vibration: "Dual motor",
      compatibility: "PC, Xbox"
    }
  },
  {
    name: "8BitDo Pro 2 Bluetooth",
    slug: "8bitdo-pro-2-bluetooth",
    categorySlug: "tay-cam",
    brand: "8BitDo",
    price: 1290000,
    oldPrice: 1490000,
    sku: "PAD-8BITDO-PRO2",
    shortDescription: "Tay cầm retro, nhiều nút tùy chỉnh.",
    description:
      "8BitDo Pro 2 có software remap nút, hỗ trợ nhiều nền tảng.",
    tags: ["tay-cam", "retro"],
    specs: {
      connection: "Bluetooth, USB-C",
      vibration: "Dual motor",
      compatibility: "PC, Switch, Android"
    }
  },
  {
    name: "Logitech F310 Wired",
    slug: "logitech-f310-wired",
    categorySlug: "tay-cam",
    brand: "Logitech",
    price: 390000,
    oldPrice: 490000,
    sku: "PAD-LOGI-F310",
    shortDescription: "Tay cầm có dây giá rẻ cho PC.",
    description:
      "Logitech F310 đơn giản, đủ dùng cho game bóng đá, đua xe.",
    tags: ["tay-cam", "budget"],
    specs: {
      connection: "Wired USB",
      vibration: "Không",
      compatibility: "PC"
    }
  },
  {
    name: "Logitech F710 Wireless",
    slug: "logitech-f710-wireless",
    categorySlug: "tay-cam",
    brand: "Logitech",
    price: 790000,
    oldPrice: 890000,
    sku: "PAD-LOGI-F710",
    shortDescription: "Tay cầm không dây cho PC.",
    description:
      "Logitech F710 dùng dongle 2.4G, cảm giác như tay cầm console.",
    tags: ["tay-cam", "wireless"],
    specs: {
      connection: "2.4G Wireless",
      vibration: "Có",
      compatibility: "PC"
    }
  },
  {
    name: "Xbox Elite Series 2 Controller",
    slug: "xbox-elite-series-2-controller",
    categorySlug: "tay-cam",
    brand: "Xbox",
    price: 4690000,
    oldPrice: 4990000,
    sku: "PAD-XBOX-ELITE2",
    shortDescription: "Tay cầm cao cấp, tùy chỉnh sâu.",
    description:
      "Xbox Elite 2 có nút thay thế, trigger ngắn, phù hợp game thủ try-hard.",
    tags: ["tay-cam", "pro"],
    specs: {
      connection: "Bluetooth, USB-C",
      vibration: "Rung phản hồi",
      compatibility: "PC, Xbox"
    }
  },
  {
    name: "Nintendo Switch Pro Controller",
    slug: "nintendo-switch-pro-controller",
    categorySlug: "tay-cam",
    brand: "Nintendo",
    price: 1990000,
    oldPrice: 2190000,
    sku: "PAD-NINTENDO-PRO",
    shortDescription: "Tay cầm chính hãng cho Switch.",
    description:
      "Switch Pro Controller cầm thoải mái, pin tốt, có gyro.",
    tags: ["tay-cam", "switch"],
    specs: {
      connection: "Bluetooth, USB-C",
      vibration: "HD Rumble",
      compatibility: "Switch, PC (driver)"
    }
  },
  {
    name: "IPEGA 9083S Mobile Gamepad",
    slug: "ipega-9083s-mobile-gamepad",
    categorySlug: "tay-cam",
    brand: "IPEGA",
    price: 590000,
    oldPrice: 690000,
    sku: "PAD-IPEGA-9083S",
    shortDescription: "Tay cầm kẹp điện thoại, giá rẻ.",
    description:
      "IPEGA 9083S phù hợp chơi game mobile, giả lập, hỗ trợ Android.",
    tags: ["tay-cam", "mobile"],
    specs: {
      connection: "Bluetooth",
      vibration: "Không",
      compatibility: "Android, PC"
    }
  }
].map((p) => ({ ...baseFields, ...p }));

/* ========== CHẠY SEED ========== */
async function run() {
  try {
    await mongoose.connect(uri);
    console.log("Đã kết nối MongoDB, xoá toàn bộ sản phẩm cũ...");
    await Product.deleteMany({});

    const products = [
      ...laptops,
      ...monitors,
      ...keyboards,
      ...mice,
      ...headsets,
      ...speakers,
      ...chairs,
      ...controllers
    ];

    await Product.insertMany(products);
    console.log(`Seed thành công ${products.length} sản phẩm.`);
  } catch (err) {
    console.error("Lỗi seed:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
