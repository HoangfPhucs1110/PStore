import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api";
import ProductCard from "../components/ProductCard";

const PER_PAGE = 12;

const CATEGORY_LABELS = {
  "laptop": "Laptop",
  "man-hinh": "Màn hình",
  "ban-phim": "Bàn phím ",
  "chuot": "Chuột",
  "tai-nghe": "Tai nghe",
  "loa": "Loa – âm thanh",
  "ghe-gaming": "Ghế",
  "tay-cam": "Tay cầm chơi game"
};


const formatMoney = (n) =>
  (typeof n === "number" ? n : Number(n || 0)).toLocaleString("vi-VN");

export default function Products() {
  const location = useLocation();
  const navigate = useNavigate();

  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);

  // bộ lọc
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [brand, setBrand] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [onlyPromo, setOnlyPromo] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  // đọc query (category, promo, sort, q) từ URL lần đầu
  useEffect(() => {
    const qs = new URLSearchParams(location.search);
    const cat = qs.get("category");
    const promo = qs.get("promo");
    const s = qs.get("sort");
    const q = qs.get("q");

    if (cat) setCategory(cat);
    if (promo === "true") setOnlyPromo(true);
    if (s) setSort(s);
    if (q) setSearch(q);
  }, [location.search]);

  // tải sản phẩm
  useEffect(() => {
    let ignore = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get("/products");
        if (!ignore) setAll(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, []);

  // danh sách category / brand
const categories = useMemo(() => {
  const set = new Set();
  all.forEach((p) => p.categorySlug && set.add(p.categorySlug));
  return Array.from(set).map((slug) => ({
    slug,
    label: CATEGORY_LABELS[slug] || slug
  }));
}, [all]);


  const brands = useMemo(() => {
    const set = new Set();
    all.forEach((p) => p.brand && set.add(p.brand));
    return Array.from(set);
  }, [all]);

  // lọc + sắp xếp
  const filtered = useMemo(() => {
    let list = [...all];

    if (search.trim()) {
      const s = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(s) ||
          p.sku?.toLowerCase().includes(s)
      );
    }

    if (category !== "all") {
      list = list.filter((p) => p.categorySlug === category);
    }

    if (brand !== "all") {
      list = list.filter((p) => p.brand === brand);
    }

    if (minPrice) {
      const m = Number(minPrice) || 0;
      list = list.filter((p) => (p.price || 0) >= m);
    }

    if (maxPrice) {
      const m = Number(maxPrice) || 0;
      list = list.filter((p) => (p.price || 0) <= m);
    }

    if (onlyPromo) {
      list = list.filter(
        (p) => p.oldPrice && p.oldPrice > (p.price || 0)
      );
    }

    if (onlyInStock) {
      list = list.filter((p) => (p.stock || 0) > 0);
    }

    // sắp xếp
    list.sort((a, b) => {
      if (sort === "priceAsc") return (a.price || 0) - (b.price || 0);
      if (sort === "priceDesc") return (b.price || 0) - (a.price || 0);
      if (sort === "sold")
        return (b.soldCount || 0) - (a.soldCount || 0);
      if (sort === "promo") {
        const da =
          (a.oldPrice || 0) > (a.price || 0)
            ? (a.oldPrice || 0) - (a.price || 0)
            : 0;
        const db =
          (b.oldPrice || 0) > (b.price || 0)
            ? (b.oldPrice || 0) - (b.price || 0)
            : 0;
        return db - da;
      }
      // newest (createdAt giảm dần)
      return (
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
      );
    });

    return list;
  }, [
    all,
    search,
    category,
    brand,
    minPrice,
    maxPrice,
    onlyPromo,
    onlyInStock,
    sort
  ]);

  // phân trang
  const totalPage = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageSafe = Math.min(page, totalPage);
  const start = (pageSafe - 1) * PER_PAGE;
  const pageItems = filtered.slice(start, start + PER_PAGE);

  useEffect(() => {
    setPage(1);
  }, [search, category, brand, minPrice, maxPrice, onlyPromo, onlyInStock]);

  const resetFilters = () => {
    setSearch("");
    setCategory("all");
    setBrand("all");
    setMinPrice("");
    setMaxPrice("");
    setOnlyPromo(false);
    setOnlyInStock(false);
    setSort("newest");
    setPage(1);
    navigate("/products", { replace: true });
  };

  return (
    <div className="home-section-bg py-4">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">Tất cả sản phẩm</h4>
          <div className="small text-muted">
            {filtered.length} sản phẩm phù hợp
          </div>
        </div>

        <div className="row g-3">
          {/* Sidebar filter */}
          <div className="col-12 col-md-3">
            <div className="bg-white rounded-3 shadow-sm p-3 mb-3">
              <h6 className="mb-3">Bộ lọc</h6>

              {/* Từ khóa */}
              <div className="mb-3">
                <label className="form-label small mb-1">
                  Từ khóa / mã sản phẩm
                </label>
                <input
                  className="form-control form-control-sm"
                  placeholder="Nhập tên, SKU..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Danh mục */}
              <div className="mb-3">
                <label className="form-label small mb-1">Danh mục</label>
<select
  className="form-select form-select-sm"
  value={category}
  onChange={(e) => setCategory(e.target.value)}
>
  <option value="all">Tất cả</option>
  {categories.map((c) => (
    <option key={c.slug} value={c.slug}>
      {c.label}
    </option>
  ))}
</select>
              </div>

              {/* Thương hiệu */}
              <div className="mb-3">
                <label className="form-label small mb-1">Thương hiệu</label>
                <select
                  className="form-select form-select-sm"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                >
                  <option value="all">Tất cả</option>
                  {brands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Giá */}
              <div className="mb-3">
                <label className="form-label small mb-1">Khoảng giá</label>
                <div className="d-flex align-items-center gap-2">
                  <input
                    className="form-control form-control-sm"
                    placeholder="Từ"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <span className="text-muted">-</span>
                  <input
                    className="form-control form-control-sm"
                    placeholder="Đến"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
                {(minPrice || maxPrice) && (
                  <div className="small text-muted mt-1">
                    {minPrice && (
                      <span>Từ {formatMoney(minPrice)} đ </span>
                    )}
                    {maxPrice && (
                      <span>đến {formatMoney(maxPrice)} đ</span>
                    )}
                  </div>
                )}
              </div>

              {/* checkbox */}
              <div className="form-check mb-2">
                <input
                  id="f-promo"
                  type="checkbox"
                  className="form-check-input"
                  checked={onlyPromo}
                  onChange={(e) => setOnlyPromo(e.target.checked)}
                />
                <label htmlFor="f-promo" className="form-check-label small">
                  Chỉ hiển thị sản phẩm đang khuyến mãi
                </label>
              </div>

              <div className="form-check mb-3">
                <input
                  id="f-stock"
                  type="checkbox"
                  className="form-check-input"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                />
                <label htmlFor="f-stock" className="form-check-label small">
                  Chỉ hiển thị sản phẩm còn hàng
                </label>
              </div>

              <button
                className="btn btn-outline-secondary w-100 btn-sm"
                onClick={resetFilters}
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>

          {/* Danh sách sản phẩm */}
          <div className="col-12 col-md-9">
            <div className="bg-white rounded-3 shadow-sm p-3">
              <div className="d-flex flex-wrap justify-content-between gap-2 align-items-center mb-3">
                <div className="small text-muted">
                  Hiển thị {pageItems.length} / {filtered.length} sản phẩm
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="small text-muted">Sắp xếp:</span>
                  <select
                    className="form-select form-select-sm"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="newest">Mới nhất</option>
                    <option value="priceAsc">Giá tăng dần</option>
                    <option value="priceDesc">Giá giảm dần</option>
                    <option value="sold">Bán chạy</option>
                    <option value="promo">Giảm giá nhiều</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-4 small text-muted">
                  Đang tải sản phẩm...
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-4 small text-muted">
                  Không tìm thấy sản phẩm phù hợp.
                </div>
              ) : (
                <>
                  <div className="row g-3">
                    {pageItems.map((p) => (
                      <div
                        key={p._id}
                        className="col-6 col-sm-4 col-lg-3"
                      >
                        <ProductCard p={p} />
                      </div>
                    ))}
                  </div>

                  {totalPage > 1 && (
                    <div className="d-flex justify-content-center mt-3">
                      <nav>
                        <ul className="pagination pagination-sm mb-0">
                          <li className={`page-item ${pageSafe === 1 && "disabled"}`}>
                            <button
                              className="page-link"
                              onClick={() =>
                                setPage((p) => Math.max(1, p - 1))
                              }
                            >
                              «
                            </button>
                          </li>
                          {Array.from({ length: totalPage }).map((_, i) => (
                            <li
                              key={i}
                              className={`page-item ${
                                pageSafe === i + 1 ? "active" : ""
                              }`}
                            >
                              <button
                                className="page-link"
                                onClick={() => setPage(i + 1)}
                              >
                                {i + 1}
                              </button>
                            </li>
                          ))}
                          <li
                            className={`page-item ${
                              pageSafe === totalPage && "disabled"
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() =>
                                setPage((p) => Math.min(totalPage, p + 1))
                              }
                            >
                              »
                            </button>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
