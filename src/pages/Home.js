import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import ProductCard from "../components/ProductCard";

const SECTIONS = [
  { slug: "laptop", title: "Laptop gaming & văn phòng" },
  { slug: "man-hinh", title: "Màn hình gaming" },
  { slug: "ban-phim", title: "Bàn phím cơ" },
  { slug: "chuot", title: "Chuột gaming" },
  { slug: "tai-nghe", title: "Tai nghe gaming" },
  { slug: "loa", title: "Loa – âm thanh" },
  { slug: "ghe-gaming", title: "Ghế gaming" },
  { slug: "tay-cam", title: "Tay cầm chơi game" }
];

const LEFT_CATEGORIES = [
  { label: "Laptop Gaming", slug: "laptop" },
  { label: "Màn hình Gaming", slug: "man-hinh" },
  { label: "Bàn phím cơ", slug: "ban-phim" },
  { label: "Chuột Gaming", slug: "chuot" },
  { label: "Tai nghe", slug: "tai-nghe" },
  { label: "Loa – Sound", slug: "loa" },
  { label: "Ghế gaming", slug: "ghe-gaming" },
  { label: "Tay cầm", slug: "tay-cam" }
];

export default function Home() {
  const navigate = useNavigate();

  const [heroBanners, setHeroBanners] = useState([]);
  const [heroIndex, setHeroIndex] = useState(0);
  const [featured, setFeatured] = useState([]);
  const [byCategory, setByCategory] = useState({});

  useEffect(() => {
    api
      .get("/banners", { params: { position: "hero" } })
      .then((res) => setHeroBanners(res.data || []))
      .catch(() => setHeroBanners([]));

    api
      .get("/products", { params: { isFeatured: true } })
      .then((res) => setFeatured(res.data.slice(0, 6)))
      .catch(() => setFeatured([]));

    Promise.all(
      SECTIONS.map((s) =>
        api
          .get("/products", {
            params: { categorySlug: s.slug, isFeatured: true }
          })
          .then((res) => [s.slug, res.data.slice(0, 4)])
          .catch(() => [s.slug, []])
      )
    ).then((entries) => setByCategory(Object.fromEntries(entries)));
  }, []);

  useEffect(() => {
    if (heroBanners.length <= 1) return;
    const timer = setInterval(
      () => setHeroIndex((i) => (i + 1) % heroBanners.length),
      5000
    );
    return () => clearInterval(timer);
  }, [heroBanners.length]);

  const hero = heroBanners[heroIndex];

  const goToCategory = (slug) => {
    navigate(`/products?category=${slug}`);
  };

  return (
    <div className="container my-3 home-hero">
      <div className="row g-3">
        {/* Cột danh mục trái */}
        <div className="col-12 col-md-3">
          <div className="bg-white rounded-3 p-2 shadow-sm h-100">
            <div className="fw-semibold mb-2 px-2 pt-1">
              DANH MỤC NỔI BẬT
            </div>
            <div className="d-flex flex-column gap-2">
              {LEFT_CATEGORIES.map((c) => (
                <button
                  key={c.slug}
                  className="btn btn-light text-start w-100 home-cat-item"
                  onClick={() => goToCategory(c.slug)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Banner + thẻ nhỏ bên phải */}
        <div className="col-12 col-md-9">
          <div className="d-flex flex-column h-100">
<div
  className="home-hero-banner rounded-3 mb-3 flex-grow-1 d-flex align-items-center"
  style={{
    background: "linear-gradient(135deg, #0062ff, #0041d9)",
    color: "white",
    minHeight: "260px"
  }}
>
  <div className="p-4 h-100 d-flex flex-column flex-md-row justify-content-between w-100">

    <div className="mb-3 mb-md-0">
      <div className="badge bg-white text-primary mb-2 fw-semibold">
        PSTORE – CÔNG NGHỆ CHO MỌI NGƯỜI
      </div>

      <h2
        className="fw-bold mb-2"
        style={{ textShadow: "0 2px 6px rgba(0,0,0,0.3)" }}
      >
        Thế giới thiết bị điện tử chính hãng
      </h2>

      <p
        className="mb-3"
        style={{ opacity: 0.9, fontSize: "15px" }}
      >
        Laptop – gaming gear – phụ kiện – màn hình máy tính.  
        Giá tốt, giao nhanh, bảo hành chính hãng.
      </p>

      <button
        className="btn btn-light fw-semibold px-4 home-hero-cta"
        onClick={() => navigate("/products")}
      >
        Khám phá ngay
      </button>
    </div>

    <div className="text-end d-flex flex-column justify-content-between">
      <div className="text-white-50 small">
        Miễn phí giao nhanh đơn từ 1.000.000đ
      </div>

      <div>
        <div
          className="fs-3 fw-bold"
          style={{ textShadow: "0 2px 5px rgba(0,0,0,0.4)" }}
        >
          Ưu đãi hấp dẫn mỗi ngày
        </div>

        <div className="small text-white-50">
          Mua sắm công nghệ dễ dàng và tiện lợi hơn tại PStore.
        </div>
      </div>
    </div>
  </div>
</div>


            {/* Hai thẻ nhỏ phía dưới banner */}
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <div className="bg-white rounded-3 shadow-sm p-3 home-hero-card h-100">
                  <h5 className="mb-1">Laptop 2025</h5>
                  <p className="text-muted small mb-2">
                    Cấu hình mạnh, mỏng nhẹ, phù hợp học tập – làm việc.
                  </p>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => goToCategory("laptop")}
                  >
                    Xem laptop
                  </button>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="bg-white rounded-3 shadow-sm p-3 home-hero-card h-100">
                  <h5 className="mb-1">Màn hình 144–165Hz</h5>
                  <p className="text-muted small mb-2">
                    Trải nghiệm game FPS mượt mà, màu sắc đẹp.
                  </p>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => goToCategory("man-hinh")}
                  >
                    Xem màn hình
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Các section sản phẩm theo danh mục */}
      <div className="mt-4">
        {SECTIONS.map((s) => {
          const items = byCategory[s.slug] || [];
          if (!items.length) return null;

          return (
            <div className="mb-4" key={s.slug}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0">{s.title}</h5>
                <button
                  className="btn btn-link small text-primary p-0"
                  onClick={() => goToCategory(s.slug)}
                >
                  Xem tất cả
                </button>
              </div>
              <div className="row g-3">
                {items.map((p) => (
                  <div className="col-6 col-md-3" key={p._id}>
                    <ProductCard p={p} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
