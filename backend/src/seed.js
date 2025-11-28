const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Category = require("./models/Category");
const Product = require("./models/Product");
const Banner = require("./models/Banner");
const Coupon = require("./models/Coupon");

const MONGO_URI = process.env.MONGO_URI;

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Mongo connected – seeding...");

  // --- CATEGORIES ---
  const categories = [
    {
      name: "Laptop",
      slug: "laptop",
      icon: "laptop",
      description: "Các dòng laptop gaming, văn phòng, đồ họa.",
      isActive: true,
      sortOrder: 1
    },
    {
      name: "Màn hình",
      slug: "man-hinh",
      icon: "monitor",
      description: "Màn hình gaming, đồ họa, văn phòng.",
      isActive: true,
      sortOrder: 2
    },
    {
      name: "Bàn phím",
      slug: "ban-phim",
      icon: "keyboard",
      description: "Bàn phím cơ gaming, văn phòng.",
      isActive: true,
      sortOrder: 3
    },
    {
      name: "Chuột",
      slug: "chuot",
      icon: "mouse",
      description: "Chuột gaming DPI cao, RGB.",
      isActive: true,
      sortOrder: 4
    },
    {
      name: "Tai nghe",
      slug: "tai-nghe",
      icon: "headset",
      description: "Tai nghe gaming 7.1, mic tốt.",
      isActive: true,
      sortOrder: 5
    },
    {
      name: "Loa",
      slug: "loa",
      icon: "speaker",
      description: "Loa vi tính, loa Bluetooth.",
      isActive: true,
      sortOrder: 6
    },
    {
      name: "Ghế gaming",
      slug: "ghe-gaming",
      icon: "chair",
      description: "Ghế gaming êm ái, hỗ trợ lưng.",
      isActive: true,
      sortOrder: 7
    },
    {
      name: "Tay cầm",
      slug: "tay-cam",
      icon: "controller",
      description: "Tay cầm chơi game cho PC/Console.",
      isActive: true,
      sortOrder: 8
    }
  ];

  // --- PRODUCTS: nhiều mẫu cho từng loại ---
  const products = [
    // Laptops
    {
      name: "Laptop ASUS TUF F15 i7 11800H | RTX 3050",
      slug: "asus-tuf-f15-i7-rtx3050",
      categorySlug: "laptop",
      brand: "ASUS",
      images: ["https://product.hstatic.net/200000722513/product/laptop1.png"],
      thumbnail: "https://product.hstatic.net/200000722513/product/laptop1.png",
      price: 21990000,
      oldPrice: 25990000,
      stock: 12,
      sku: "ASUSF15-11800H-3050",
      status: "active",
      specs: {
        cpu: "Intel Core i7-11800H",
        ram: "16GB DDR4",
        ssd: "512GB NVMe",
        screen: "15.6' FHD 144Hz",
        gpu: "NVIDIA RTX 3050"
      },
      tags: ["gaming", "laptop"],
      isFeatured: true,
      isNew: false,
      soldCount: 120,
      ratingAvg: 4.7,
      ratingCount: 58
    },
    {
      name: "Laptop MSI GF63 i5 11400H | GTX 1650",
      slug: "msi-gf63-i5-1650",
      categorySlug: "laptop",
      brand: "MSI",
      images: ["https://product.hstatic.net/200000722513/product/msi1.png"],
      thumbnail: "https://product.hstatic.net/200000722513/product/msi1.png",
      price: 14990000,
      oldPrice: 17990000,
      stock: 9,
      sku: "MSIGF63-11400H-1650",
      status: "active",
      specs: {
        cpu: "Intel Core i5-11400H",
        ram: "8GB DDR4",
        ssd: "512GB NVMe",
        screen: "15.6' FHD 144Hz",
        gpu: "NVIDIA GTX 1650"
      },
      tags: ["gaming", "budget"],
      isFeatured: true,
      isNew: true,
      soldCount: 200,
      ratingAvg: 4.5,
      ratingCount: 120
    },
    {
      name: "Laptop Acer Nitro 5 i5 12500H | RTX 3050Ti",
      slug: "acer-nitro5-i5-12500h-3050ti",
      categorySlug: "laptop",
      brand: "Acer",
      images: ["https://product.hstatic.net/200000722513/product/nitro5.png"],
      thumbnail: "https://product.hstatic.net/200000722513/product/nitro5.png",
      price: 23990000,
      oldPrice: 27990000,
      stock: 15,
      sku: "ACERN5-12500H-3050TI",
      status: "active",
      specs: {
        cpu: "Intel Core i5-12500H",
        ram: "16GB DDR4",
        ssd: "512GB NVMe",
        screen: "15.6' FHD 165Hz",
        gpu: "NVIDIA RTX 3050 Ti"
      },
      tags: ["gaming"],
      isFeatured: false,
      isNew: false,
      soldCount: 80,
      ratingAvg: 4.8,
      ratingCount: 40
    },
    {
      name: "Laptop Lenovo Legion 5 R7 6800H | RTX 3060",
      slug: "lenovo-legion5-r7-3060",
      categorySlug: "laptop",
      brand: "Lenovo",
      images: ["https://product.hstatic.net/200000722513/product/legion5.png"],
      thumbnail: "https://product.hstatic.net/200000722513/product/legion5.png",
      price: 28990000,
      oldPrice: 31990000,
      stock: 7,
      sku: "LNV-L5-R7-3060",
      status: "active",
      specs: {
        cpu: "AMD Ryzen 7 6800H",
        ram: "16GB DDR5",
        ssd: "1TB NVMe",
        screen: "15.6' QHD 165Hz",
        gpu: "NVIDIA RTX 3060"
      },
      tags: ["gaming", "high-end"],
      isFeatured: true,
      isNew: false,
      soldCount: 60,
      ratingAvg: 4.9,
      ratingCount: 35
    },

    // Monitors
    {
      name: "Màn hình AOC 27' IPS 165Hz",
      slug: "aoc-27-ips-165hz",
      categorySlug: "man-hinh",
      brand: "AOC",
      images: ["https://product.hstatic.net/200000722513/product/monitor1.png"],
      thumbnail: "https://product.hstatic.net/200000722513/product/monitor1.png",
      price: 3990000,
      oldPrice: 4490000,
      stock: 20,
      sku: "AOC27-165HZ-IPS",
      status: "active",
      specs: {
        size: "27 inch",
        hz: "165Hz",
        panel: "IPS"
      },
      tags: ["gaming", "165hz"],
      isFeatured: true,
      isNew: false,
      soldCount: 85,
      ratingAvg: 4.6,
      ratingCount: 40
    },
    {
      name: "Màn hình ViewSonic 24' IPS 144Hz",
      slug: "viewsonic-24-ips-144hz",
      categorySlug: "man-hinh",
      brand: "ViewSonic",
      images: ["https://product.hstatic.net/200000722513/product/monitor2.png"],
      thumbnail: "https://product.hstatic.net/200000722513/product/monitor2.png",
      price: 3490000,
      oldPrice: 3790000,
      stock: 30,
      sku: "VS24-144HZ-IPS",
      status: "active",
      specs: {
        size: "24 inch",
        hz: "144Hz",
        panel: "IPS"
      },
      tags: ["gaming"],
      isFeatured: false,
      isNew: true,
      soldCount: 60,
      ratingAvg: 4.5,
      ratingCount: 25
    },
    {
      name: "Màn hình Samsung 32' VA 165Hz cong",
      slug: "samsung-32-va-165hz",
      categorySlug: "man-hinh",
      brand: "Samsung",
      images: ["https://product.hstatic.net/200000722513/product/monitor3.png"],
      thumbnail: "https://product.hstatic.net/200000722513/product/monitor3.png",
      price: 5990000,
      oldPrice: 6590000,
      stock: 10,
      sku: "SSG32-165HZ-VA",
      status: "active",
      specs: {
        size: "32 inch",
        hz: "165Hz",
        panel: "VA",
        curve: "1500R"
      },
      tags: ["gaming", "curve"],
      isFeatured: true,
      isNew: false,
      soldCount: 30,
      ratingAvg: 4.6,
      ratingCount: 18
    },

    // Keyboards
    {
      name: "Bàn phím Akko 3068B Plus Wireless",
      slug: "akko-3068b-plus",
      categorySlug: "ban-phim",
      brand: "Akko",
      images: ["https://product.hstatic.net/200000722513/product/akko.png"],
      thumbnail: "https://product.hstatic.net/200000722513/product/akko.png",
      price: 1690000,
      oldPrice: 1890000,
      stock: 30,
      sku: "AKKO-3068B",
      status: "active",
      specs: {
        layout: "68 phím",
        connection: "Wireless/Bluetooth/USB",
        switch: "Akko Switch v3"
      },
      tags: ["keyboard", "wireless"],
      isFeatured: true,
      isNew: false,
      soldCount: 150,
      ratingAvg: 4.8,
      ratingCount: 80
    },
    {
      name: "Bàn phím Logitech G213 RGB",
      slug: "logitech-g213",
      categorySlug: "ban-phim",
      brand: "Logitech",
      images: ["https://product.hstatic.net/200000722513/product/g213.png"],
      thumbnail: "https://product.hstatic.net/200000722513/product/g213.png",
      price: 990000,
      oldPrice: 1190000,
      stock: 40,
      sku: "LOGI-G213",
      status: "active",
      specs: {
        layout: "Fullsize",
        type: "Membrane",
        rgb: "Yes"
      },
      tags: ["keyboard", "rgb"],
      isFeatured: false,
      isNew: true,
      soldCount: 90,
      ratingAvg: 4.4,
      ratingCount: 35
    },

    // Mice
    {
      name: "Chuột Logitech G102 LightSync",
      slug: "logitech-g102",
      categorySlug: "chuot",
      brand: "Logitech",
      images: ["https://product.hstatic.net/200000722513/product/g102.png"],
      thumbnail: "https://product.hstatic.net/200000722513/product/g102.png",
      price: 390000,
      oldPrice: 490000,
      stock: 50,
      sku: "LOGI-G102",
      status: "active",
      specs: {
        dpi: "8000 DPI",
        rgb: "Yes"
      },
      tags: ["gear", "mouse"],
      isFeatured: true,
      isNew: true,
      soldCount: 500,
      ratingAvg: 4.8,
      ratingCount: 300
    },
    {
      name: "Chuột Razer DeathAdder Essential",
      slug: "razer-deathadder",
      categorySlug: "chuot",
      brand: "Razer",
      images: ["https://product.hstatic.net/200000722513/product/razer.png"],
      thumbnail: "https://product.hstatic.net/200000722513/product/razer.png",
      price: 490000,
      oldPrice: 590000,
      stock: 35,
      sku: "RAZER-DA-ESS",
      status: "active",
      specs: {
        dpi: "6400 DPI",
        rgb: "No"
      },
      tags: ["mouse"],
      isFeatured: false,
      isNew: false,
      soldCount: 220,
      ratingAvg: 4.6,
      ratingCount: 110
    },

    // Headsets
    {
      name: "Tai nghe HyperX Cloud II",
      slug: "hyperx-cloud2",
      categorySlug: "tai-nghe",
      brand: "HyperX",
      images: ["https://product.hstatic.net/200000722513/product/hyperx2.png"],
      thumbnail: "https://product.hstatic.net/200000722513/product/hyperx2.png",
      price: 1690000,
      oldPrice: 1890000,
      stock: 25,
      sku: "HYPERX-CLOUD2",
      status: "active",
      specs: {
        type: "Over-ear",
        mic: "Có",
        surround: "7.1"
      },
      tags: ["headset", "gaming"],
      isFeatured: true,
      isNew: false,
      soldCount: 140,
      ratingAvg: 4.8,
      ratingCount: 70
    },
    {
      name: "Tai nghe Razer Kraken X Lite",
      slug: "razer-kraken-x-lite",
      categorySlug: "tai-nghe",
      brand: "Razer",
      images: ["https://product.hstatic.net/200000722513/product/krakenx.png"],
      thumbnail: "https://product.hstatic.net/200000722513/product/krakenx.png",
      price: 890000,
      oldPrice: 1090000,
      stock: 40,
      sku: "RAZER-KRAKEN-X",
      status: "active",
      specs: {
        type: "Over-ear",
        mic: "Có",
        surround: "7.1"
      },
      tags: ["headset"],
      isFeatured: false,
      isNew: true,
      soldCount: 90,
      ratingAvg: 4.5,
      ratingCount: 30
    },

    // Speakers
    {
      name: "Loa Logitech Z313 2.1",
      slug: "logitech-z313",
      categorySlug: "loa",
      brand: "Logitech",
      images: ["https://product.hstatic.net/200000722513/product/z313.png"],
      thumbnail: "https://product.hstatic.net/200000722513/product/z313.png",
      price: 890000,
      oldPrice: 990000,
      stock: 20,
      sku: "LOGI-Z313",
      status: "active",
      specs: {
        channel: "2.1",
        power: "25W"
      },
      tags: ["speaker", "2.1"],
      isFeatured: true,
      isNew: false,
      soldCount: 70,
      ratingAvg: 4.6,
      ratingCount: 25
    },
    {
      name: "Loa Bluetooth JBL Go 3",
      slug: "jbl-go-3",
      categorySlug: "loa",
      brand: "JBL",
      images: ["https://product.hstatic.net/200000722513/product/jblgo3.png"],
      thumbnail: "https://product.hstatic.net/200000722513/product/jblgo3.png",
      price: 990000,
      oldPrice: 1190000,
      stock: 50,
      sku: "JBL-GO3",
      status: "active",
      specs: {
        type: "Bluetooth",
        waterproof: "IP67"
      },
      tags: ["speaker", "bluetooth"],
      isFeatured: false,
      isNew: true,
      soldCount: 60,
      ratingAvg: 4.7,
      ratingCount: 22
    },

    // Chairs
    {
      name: "Ghế gaming E-Dra Hercules",
      slug: "ghe-gaming-edra-hercules",
      categorySlug: "ghe-gaming",
      brand: "E-Dra",
      images: ["https://product.hstatic.net/200000722513/product/chair1.png"],
      thumbnail: "https://product.hstatic.net/200000722513/product/chair1.png",
      price: 3290000,
      oldPrice: 3690000,
      stock: 10,
      sku: "EDRA-HERCULES",
      status: "active",
      specs: {
        material: "Da PU",
        weightSupport: "150kg"
      },
      tags: ["chair", "gaming"],
      isFeatured: true,
      isNew: false,
      soldCount: 40,
      ratingAvg: 4.6,
      ratingCount: 18
    },

    // Controllers
    {
      name: "Tay cầm Xbox Controller USB",
      slug: "xbox-controller-usb",
      categorySlug: "tay-cam",
      brand: "Microsoft",
      images: ["https://product.hstatic.net/200000722513/product/xboxpad.png"],
      thumbnail: "https://product.hstatic.net/200000722513/product/xboxpad.png",
      price: 1290000,
      oldPrice: 1490000,
      stock: 25,
      sku: "XBOX-PAD-USB",
      status: "active",
      specs: {
        connection: "USB có dây",
        support: "PC / Xbox"
      },
      tags: ["controller"],
      isFeatured: true,
      isNew: false,
      soldCount: 55,
      ratingAvg: 4.7,
      ratingCount: 20
    }
  ];

  // --- BANNERS ---
  const banners = [
    {
      title: "SALE Gaming Gear",
      subTitle: "Giảm tới 40% chuột, phím, tai nghe",
      image: "https://i.imgur.com/vqV2e1z.png",
      link: "/products",
      position: "hero",
      isActive: true,
      sortOrder: 1
    },
    {
      title: "Laptop 2025",
      subTitle: "Cấu hình mạnh – giá tốt",
      image: "https://i.imgur.com/8DnqjCF.png",
      link: "/products?category=laptop",
      position: "mini-left",
      isActive: true,
      sortOrder: 2
    }
  ];

  // --- COUPONS ---
  const coupons = [
    {
      code: "SALE10",
      type: "percent",
      value: 10,
      minOrder: 1000000,
      maxDiscount: 500000,
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-12-31"),
      usageLimit: 500,
      usedCount: 0,
      isActive: true,
      applicableCategories: [],
      applicableUserIds: []
    },
    {
      code: "FLAT50",
      type: "fixed",
      value: 50000,
      minOrder: 300000,
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-12-31"),
      usageLimit: 0,
      usedCount: 0,
      isActive: true,
      applicableCategories: [],
      applicableUserIds: []
    }
  ];

  // Xóa cũ + insert mới
  await Category.deleteMany({});
  await Product.deleteMany({});
  await Banner.deleteMany({});
  await Coupon.deleteMany({});

  await Category.insertMany(categories);
  await Product.insertMany(products);
  await Banner.insertMany(banners);
  await Coupon.insertMany(coupons);

  console.log("Seed xong 🎉");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
