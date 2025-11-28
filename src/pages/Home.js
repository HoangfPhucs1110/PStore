import { useEffect, useState } from "react";
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

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [heroBanners, setHeroBanners] = useState([]);
  const [byCategory, setByCategory] = useState({});

  useEffect(() => {
    api
      .get("/products", { params: { isFeatured: true } })
      .then((res) => setFeatured(res.data.slice(0, 8)));

    api
      .get("/banners", { params: { position: "hero" } })
      .then((res) => setHeroBanners(res.data));

    // load từng category
    Promise.all(
      SECTIONS.map((s) =>
        api
          .get("/products", { params: { categorySlug: s.slug } })
          .then((res) => ({ slug: s.slug, items: res.data.slice(0, 4) }))
      )
    ).then((results) => {
      const map = {};
      results.forEach((r) => {
        map[r.slug] = r.items;
      });
      setByCategory(map);
    });
  }, []);

  const cats = [
    { label: "Laptop Gaming", slug: "laptop" },
    { label: "Màn hình Gaming", slug: "man-hinh" },
    { label: "Bàn phím cơ", slug: "ban-phim" },
    { label: "Chuột Gaming", slug: "chuot" },
    { label: "Tai nghe", slug: "tai-nghe" },
    { label: "Loa – Sound", slug: "loa" },
    { label: "Ghế gaming", slug: "ghe-gaming" },
    { label: "Tay cầm", slug: "tay-cam" }
  ];

  return (
    <div className="container home-hero">
      <div className="row g-3">
        {/* left categories */}
        <div className="col-12 col-md-3">
          <div className="bg-white rounded-3 p-2 shadow-sm">
            <h6 className="mb-2 fw-bold text-uppercase text-muted">
              Danh mục nổi bật
            </h6>
            {cats.map((c) => (
              <a
                key={c.slug}
                href={`/products?category=${c.slug}`}
                className="cat-card mb-2 text-decoration-none d-block"
              >
                {c.label}
              </a>
            ))}
          </div>
        </div>

        {/* hero banner + promo */}
        <div className="col-12 col-md-9">
          {heroBanners[0] ? (
            <div className="hero-banner mb-3 d-flex flex-column flex-md-row align-items-center">
              <div className="flex-grow-1">
                <h1>{heroBanners[0].title}</h1>
                <p>{heroBanners[0].subTitle}</p>
                <a href={heroBanners[0].link} className="btn btn-light">
                  Xem ưu đãi
                </a>
              </div>
              <img
                src={heroBanners[0].image}
                alt=""
                className="img-fluid mt-3 mt-md-0 rounded-3"
                style={{ maxHeight: 220 }}
              />
            </div>
          ) : (
            <div className="hero-banner mb-3">
              <h1>PC – Laptop – Gaming Gear chính hãng</h1>
              <p>Giảm giá sốc, build PC theo yêu cầu, bảo hành tận nơi.</p>
              <button className="btn btn-light">Xem deal hot hôm nay</button>
            </div>
          )}

          <div className="row g-3">
            <div className="col-md-6">
              <div className="bg-white rounded-3 p-3 shadow-sm h-100">
                <h6 className="text-primary mb-1">Laptop 2025</h6>
                <p className="mb-2 small text-muted">
                  Cấu hình mạnh, mỏng nhẹ, phù hợp học tập – làm việc.
                </p>
                <a
                  href="/products?category=laptop"
                  className="btn btn-outline-primary btn-sm"
                >
                  Xem laptop
                </a>
              </div>
            </div>
            <div className="col-md-6">
              <div className="bg-white rounded-3 p-3 shadow-sm h-100">
                <h6 className="text-primary mb-1">Màn hình 144–165Hz</h6>
                <p className="mb-2 small text-muted">
                  Trải nghiệm game FPS mượt mà, màu sắc đẹp.
                </p>
                <a
                  href="/products?category=man-hinh"
                  className="btn btn-outline-primary btn-sm"
                >
                  Xem màn hình
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* featured products */}
      <div className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h4 className="mb-0">Sản phẩm nổi bật</h4>
          <a href="/products" className="small text-primary">
            Xem tất cả
          </a>
        </div>
        <div className="row g-3">
          {featured.map((p) => (
            <div className="col-6 col-md-3" key={p._id}>
              <ProductCard p={p} />
            </div>
          ))}
        </div>
      </div>

      {/* section cho từng loại sản phẩm */}
      {SECTIONS.map((sec) => {
        const items = byCategory[sec.slug] || [];
        if (!items.length) return null;
        return (
          <div className="mt-4" key={sec.slug}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="mb-0">{sec.title}</h5>
              <a
                href={`/products?category=${sec.slug}`}
                className="small text-primary"
              >
                Xem tất cả
              </a>
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
  );
}
