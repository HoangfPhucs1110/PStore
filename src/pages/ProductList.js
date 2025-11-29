import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api";

const CATEGORIES = [
  { slug: "all", label: "Tất cả" },
  { slug: "laptop", label: "Laptop" },
  { slug: "man-hinh", label: "Màn hình" },
  { slug: "ban-phim", label: "Bàn phím" },
  { slug: "chuot", label: "Chuột" },
  { slug: "tai-nghe", label: "Tai nghe" },
  { slug: "loa", label: "Loa" },
  { slug: "ghe-gaming", label: "Ghế gaming" },
  { slug: "tay-cam", label: "Tay cầm" }
];

const formatMoney = (n) => {
  const num = typeof n === "number" ? n : Number(n || 0);
  return num.toLocaleString();
};

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const categorySlug = searchParams.get("category") || "all";
  const keyword = searchParams.get("q") || "";

  useEffect(() => {
    const params = {};
    if (categorySlug !== "all") params.categorySlug = categorySlug;
    if (keyword) params.keyword = keyword;

    setLoading(true);
    api
      .get("/products", { params })
      .then((res) => setList(res.data || []))
      .finally(() => setLoading(false));
  }, [categorySlug, keyword]);

  const handleCategoryChange = (slug) => {
    const next = new URLSearchParams(searchParams);
    if (slug === "all") next.delete("category");
    else next.set("category", slug);
    setSearchParams(next);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const value = e.target.keyword.value.trim();
    const next = new URLSearchParams(searchParams);
    if (value) next.set("q", value);
    else next.delete("q");
    setSearchParams(next);
  };

  return (
    <div className="container my-3">
      <div className="row g-3">
        <div className="col-md-3">
          <div className="bg-white rounded-3 shadow-sm p-3 mb-3">
            <h6 className="mb-2">Danh mục</h6>
            <div className="vstack gap-1">
              {CATEGORIES.map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  className={
                    "btn btn-sm text-start " +
                    (categorySlug === c.slug ? "btn-primary" : "btn-light")
                  }
                  onClick={() => handleCategoryChange(c.slug)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3 shadow-sm p-3">
            <h6 className="mb-2">Tìm kiếm</h6>
            <form onSubmit={handleSearch}>
              <input
                name="keyword"
                className="form-control form-control-sm mb-2"
                placeholder="Nhập tên sản phẩm..."
                defaultValue={keyword}
              />
              <button className="btn btn-primary btn-sm w-100" type="submit">
                Tìm kiếm
              </button>
            </form>
          </div>
        </div>

        <div className="col-md-9">
          {loading && <p>Đang tải...</p>}
          {!loading && list.length === 0 && (
            <p className="text-muted">Không có sản phẩm phù hợp.</p>
          )}

          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            {list.map((p) => (
              <div className="col" key={p._id}>
                <div className="card h-100 border-0 shadow-sm">
                  <Link
                    to={`/products/${p.slug}`}
                    className="text-decoration-none text-dark"
                  >
                    <img
                      src={p.thumbnail || p.images?.[0]}
                      alt={p.name}
                      className="card-img-top p-3"
                      style={{ height: 180, objectFit: "contain" }}
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/300x200?text=No+Image";
                      }}
                    />
                    <div className="card-body pt-0">
                      <h6 className="product-name-2line mb-1 text-dark">
                        {p.name}
                      </h6>
                      {p.oldPrice > p.price && (
                        <div className="small text-muted text-decoration-line-through">
                          {formatMoney(p.oldPrice)} đ
                        </div>
                      )}
                      <div className="fw-semibold text-danger mb-1">
                        {formatMoney(p.price)} đ
                      </div>
                      {p.isNew && (
                        <span className="badge bg-success-subtle text-success">
                          NEW
                        </span>
                      )}
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
