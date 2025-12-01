// Định nghĩa bộ lọc cho từng danh mục
export const FILTER_OPTIONS = {
    "laptop-gaming": [
      { label: "Vi xử lý (CPU)", key: "CPU", options: ["Core i5", "Core i7", "Core i9", "Ryzen 5", "Ryzen 7"] },
      { label: "RAM", key: "RAM", options: ["8GB", "16GB", "32GB", "64GB"] },
      { label: "Card đồ họa", key: "GPU", options: ["RTX 3050", "RTX 4050", "RTX 4060", "RTX 4070"] }
    ],
    "laptop-van-phong": [
      { label: "Vi xử lý (CPU)", key: "CPU", options: ["Core i3", "Core i5", "Core i7", "Ryzen 5"] },
      { label: "RAM", key: "RAM", options: ["8GB", "16GB", "32GB"] },
      { label: "Ổ cứng", key: "SSD", options: ["256GB", "512GB", "1TB"] }
    ],
    "man-hinh": [
      { label: "Tần số quét", key: "Tần số quét", options: ["60Hz", "75Hz", "144Hz", "165Hz", "240Hz"] },
      { label: "Độ phân giải", key: "Độ phân giải", options: ["FHD", "2K", "4K"] },
      { label: "Tấm nền", key: "Tấm nền", options: ["IPS", "VA", "TN", "OLED"] }
    ],
    "ban-phim": [
      { label: "Loại Switch", key: "Switch", options: ["Red", "Blue", "Brown"] },
      { label: "Kết nối", key: "Kết nối", options: ["Có dây", "Bluetooth", "Wireless"] }
    ],
    "chuot": [
      { label: "Kết nối", key: "Kết nối", options: ["Có dây", "Wireless", "Bluetooth"] },
      { label: "DPI", key: "DPI", options: ["16000", "20000", "25000", "30000"] }
    ]
  };