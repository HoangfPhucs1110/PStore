import { useEffect, useMemo, useState } from "react";
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
  const [byCategory, setByCategory] = useState({});
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // tải dữ liệu
  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      try {
        const [bannersRes, productsRes, ...sectionRes] = await Promise.all([
          api
            .get("/banners", { params: { position: "hero" } })
            .catch(() => ({ data: [] })),
          api.get("/products").catch(() => ({ data: [] })),
          ...SECTIONS.map((s) =>
            api
              .get("/products", {
                params: { categorySlug: s.slug, isFeatured: true }
              })
              .catch(() => ({ data: [] }))
          )
        ]);

        setHeroBanners(bannersRes.data || []);
        setAllProducts(productsRes.data || []);

        const entries = sectionRes.map((res, idx) => [
          SECTIONS[idx].slug,
          (res.data || []).slice(0, 8)
        ]);
        setByCategory(Object.fromEntries(entries));
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, []);

  // auto chuyển banner
  useEffect(() => {
    if (heroBanners.length <= 1) return;
    const timer = setInterval(
      () => setHeroIndex((i) => (i + 1) % heroBanners.length),
      6000
    );
    return () => clearInterval(timer);
  }, [heroBanners.length]);

  const hero = heroBanners[heroIndex];

  // các nhóm sản phẩm
  const promoProducts = useMemo(() => {
    const promo = allProducts.filter(
      (p) => p.oldPrice && p.oldPrice > p.price
    );
    if (promo.length) return promo.slice(0, 6);
    // fallback nếu chưa set giảm giá
    return allProducts.slice(0, 6);
  }, [allProducts]);

  const topSold = useMemo(() => {
    const sorted = [...allProducts].sort(
      (a, b) => (b.soldCount || 0) - (a.soldCount || 0)
    );
    return sorted.slice(0, 6);
  }, [allProducts]);

  const trendingProducts = useMemo(() => {
    const sorted = [...allProducts].sort(
      (a, b) =>
        new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );
    return sorted.slice(0, 12);
  }, [allProducts]);

  const recommended = useMemo(() => {
    if (topSold.length >= 6) return topSold;
    if (trendingProducts.length >= 6) return trendingProducts.slice(0, 6);
    return allProducts.slice(0, 6);
  }, [topSold, trendingProducts, allProducts]);

  // carousel xu hướng
  const [trendIndex, setTrendIndex] = useState(0);
  const visibleTrending = useMemo(() => {
    if (!trendingProducts.length) return [];
    const maxShow = 4;
    const arr = [];
    for (let i = 0; i < Math.min(maxShow, trendingProducts.length); i++) {
      arr.push(trendingProducts[(trendIndex + i) % trendingProducts.length]);
    }
    return arr;
  }, [trendingProducts, trendIndex]);

  const goToCategory = (slug) => navigate(`/products?category=${slug}`);
  const goToProducts = () => navigate("/products");

  const nextTrend = () => {
    if (!trendingProducts.length) return;
    setTrendIndex((i) => (i + 1) % trendingProducts.length);
  };

  const prevTrend = () => {
    if (!trendingProducts.length) return;
    setTrendIndex((i) =>
      (i - 1 + trendingProducts.length) % trendingProducts.length
    );
  };

  return (
    <div className="home-page-wrapper">
      {/* HERO + CATEGORY LEFT */}
      <div className="container my-3">
        <div className="row g-3">
          {/* Cột danh mục trái */}
          <div className="col-12 col-md-3">
            <div className="bg-white rounded-3 p-3 shadow-sm h-100">
              <div className="fw-semibold mb-3 px-1 text-uppercase small text-muted">
                Danh mục nổi bật
              </div>
              <div className="d-flex flex-column gap-1">
                {LEFT_CATEGORIES.map((c) => (
                  <button
                    key={c.slug}
                    className="btn btn-light text-start w-100 home-cat-item d-flex justify-content-between align-items-center"
                    onClick={() => goToCategory(c.slug)}
                  >
                    <span>{c.label}</span>
                    <span className="text-muted small">&gt;</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Banner + card khuyến mãi / bán chạy */}
          <div className="col-12 col-md-9">
            <div className="d-flex flex-column h-100">
              {/* HERO */}
              <div
                className="home-hero-banner rounded-3 mb-3 shadow-sm overflow-hidden position-relative"
                style={{
                  minHeight: 260,
                  background:
                    "linear-gradient(135deg, #0062ff 0%, #002f9e 50%, #00154f 100%)",
                  color: "white"
                }}
              >
                <div className="row h-100 g-0">
                  {/* Text bên trái */}
                  <div className="col-12 col-md-7">
                    <div className="p-4 d-flex flex-column h-100 justify-content-between">
                      <div>
                        <div className="badge bg-white text-primary mb-2 fw-semibold">
                          PSTORE – CÔNG NGHỆ CHO MỌI NGƯỜI
                        </div>
                        <h2
                          className="fw-bold mb-2"
                          style={{ textShadow: "0 2px 6px rgba(0,0,0,0.4)" }}
                        >
                          Thế giới thiết bị điện tử chính hãng
                        </h2>
                        <p
                          className="mb-3"
                          style={{ opacity: 0.9, fontSize: 15 }}
                        >
                          Laptop, gaming gear, màn hình, phụ kiện. Giá tốt,
                          giao nhanh, bảo hành chính hãng trên toàn quốc.
                        </p>
                      </div>
                      <div className="d-flex flex-wrap gap-2 align-items-center">
                        <button
                          className="btn btn-light fw-semibold px-4 home-hero-cta"
                          onClick={goToProducts}
                        >
                          Khám phá ngay
                        </button>
                        <div className="small text-white-50">
                          Miễn phí giao hàng đơn từ{" "}
                          <span className="fw-semibold text-white">
                            1.000.000đ
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hình / banner bên phải */}
                  <div className="col-12 col-md-5 d-none d-md-block">
                    <div className="h-100 d-flex align-items-center justify-content-center p-3">
                      {hero && hero.imageUrl ? (
                        <img
                          src={hero.imageUrl}
                          alt={hero.title || "PStore banner"}
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                            filter:
                              "drop-shadow(0 10px 25px rgba(0,0,0,0.5))"
                          }}
                        />
                      ) : (
                        <div
                          className="rounded-3 d-flex flex-column justify-content-center align-items-center text-center px-3"
                          style={{
                            width: "100%",
                            height: "100%",
                            background:
                              "radial-gradient(circle at top, rgba(255,255,255,0.25), transparent 55%)"
                          }}
                        >
                          <div className="fs-4 fw-bold mb-2">
                            Ưu đãi hấp dẫn mỗi ngày
                          </div>
                          <div className="small text-white-50">
                            Mua sắm công nghệ dễ dàng và tiện lợi hơn tại
                            PStore.
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Dots chuyển banner */}
                    {heroBanners.length > 1 && (
                      <div className="position-absolute bottom-0 start-50 translate-middle-x mb-2">
                        <div className="d-flex gap-1">
                          {heroBanners.map((_, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setHeroIndex(idx)}
                              className="p-0 border-0 bg-transparent"
                            >
                              <span
                                style={{
                                  display: "block",
                                  width: idx === heroIndex ? 18 : 8,
                                  height: 8,
                                  borderRadius: 999,
                                  backgroundColor:
                                    idx === heroIndex
                                      ? "white"
                                      : "rgba(255,255,255,0.4)",
                                  transition: "all 0.2s"
                                }}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Hai thẻ nhỏ mới: Khuyến mãi + Bán chạy */}
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <div className="bg-white rounded-3 shadow-sm p-3 home-hero-card h-100 d-flex flex-column">
                    <h5 className="mb-1 text-danger fw-bold">🔥 Khuyến mãi HOT</h5>
                    <p className="text-muted small mb-2">
                      Giảm giá lên đến 30% cho nhiều sản phẩm công nghệ.
                    </p>
                    <div className="mt-auto d-flex justify-content-between align-items-center">
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => navigate("/products?promo=true")}
                      >
                        Xem khuyến mãi
                      </button>
                      <span className="small text-muted">
                        Số lượng có hạn, đổi giá theo ngày.
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="bg-white rounded-3 shadow-sm p-3 home-hero-card h-100 d-flex flex-column">
                    <h5 className="mb-1 text-primary fw-bold">⭐ Bán chạy nhất</h5>
                    <p className="text-muted small mb-2">
                      Được nhiều khách hàng lựa chọn và đánh giá cao.
                    </p>
                    <div className="mt-auto d-flex justify-content-between align-items-center">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => navigate("/products?sort=sold")}
                      >
                        Xem top bán chạy
                      </button>
                      <span className="small text-muted">
                        Cập nhật liên tục theo số lượng bán.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>      

      {/* KHUYẾN MÃI HOT */}
      <div className="home-section-bg py-4">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="mb-0">Khuyến mãi hot</h5>
            <button
              className="btn btn-link p-0 small text-danger"
              onClick={() => navigate("/products?promo=true")}
            >
              Xem tất cả khuyến mãi
            </button>
          </div>
          <div className="bg-white rounded-3 shadow-sm p-3">
            {loading ? (
              <div className="text-center py-4 small text-muted">
                Đang tải sản phẩm...
              </div>
            ) : promoProducts.length === 0 ? (
              <div className="text-center py-4 small text-muted">
                Hiện chưa có chương trình khuyến mãi.
              </div>
            ) : (
              <div className="row g-3">
                {promoProducts.map((p) => (
                  <div key={p._id} className="col-6 col-md-3 col-xl-2">
                    <ProductCard p={p} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TOP BÁN CHẠY */}
      <div className="container my-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="mb-0">Top bán chạy</h5>
          <button
            className="btn btn-link p-0 small text-primary"
            onClick={() => navigate("/products?sort=sold")}
          >
            Xem tất cả
          </button>
        </div>
        <div className="bg-white rounded-3 shadow-sm p-3">
          {loading ? (
            <div className="text-center py-4 small text-muted">
              Đang tải sản phẩm...
            </div>
          ) : topSold.length === 0 ? (
            <div className="text-center py-4 small text-muted">
              Chưa có dữ liệu bán chạy.
            </div>
          ) : (
            <div className="row g-3">
              {topSold.map((p) => (
                <div key={p._id} className="col-6 col-md-3 col-xl-2">
                  <ProductCard p={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

{/* XU HƯỚNG HIỆN NAY – CAROUSEL */}
<div className="home-section-bg py-4">
  <div className="container">
    <div className="d-flex justify-content-between align-items-center mb-2">
      <h5 className="mb-0">Xu hướng hiện nay</h5>

      {trendingProducts.length > 0 && (
        <div className="trending-nav">
          <button
            type="button"
            className="trending-btn"
            onClick={prevTrend}
          >
            ‹
          </button>
          <button
            type="button"
            className="trending-btn"
            onClick={nextTrend}
          >
            ›
          </button>
        </div>
      )}
    </div>

    <div className="bg-white rounded-3 shadow-sm p-3">
      {loading ? (
        <div className="text-center py-4 small text-muted">
          Đang tải sản phẩm...
        </div>
      ) : !trendingProducts.length ? (
        <div className="text-center py-4 small text-muted">
          Chưa có sản phẩm xu hướng.
        </div>
      ) : (
        <div className="row g-3">
          {visibleTrending.map((p) => (
            <div key={p._id} className="col-6 col-md-3 trending-card">
              <ProductCard p={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
</div>


      {/* GỢI Ý CHO BẠN */}
      <div className="container my-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="mb-0">Gợi ý cho bạn</h5>
          <button
            className="btn btn-link p-0 small text-primary"
            onClick={goToProducts}
          >
            Xem thêm sản phẩm
          </button>
        </div>
        <div className="bg-white rounded-3 shadow-sm p-3">
          {loading ? (
            <div className="text-center py-4 small text-muted">
              Đang tải gợi ý...
            </div>
          ) : recommended.length === 0 ? (
            <div className="text-center py-4 small text-muted">
              Chưa có gợi ý phù hợp.
            </div>
          ) : (
            <div className="row g-3">
              {recommended.map((p) => (
                <div key={p._id} className="col-6 col-md-3 col-xl-2">
                  <ProductCard p={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SECTIONS THEO DANH MỤC */}
      <div className="container my-4">
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
              <div className="bg-white rounded-3 shadow-sm p-3">
                <div className="row g-3">
                  {items.map((p) => (
                    <div className="col-6 col-md-3 col-xl-2" key={p._id}>
                      <ProductCard p={p} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
