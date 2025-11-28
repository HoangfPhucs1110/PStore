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

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  const activeCat = searchParams.get("category") || "all";
  const q = searchParams.get("q") || "";

  useEffect(() => {
    setLoading(true);
    api
      .get("/products", {
        params: {
          categorySlug: activeCat === "all" ? undefined : activeCat,
          q: q || undefined
        }
      })
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  }, [activeCat, q]);

  const changeCategory = (slug) => {
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
      <div className="d-flex flex-wrap gap-2 mb-3">
        {CATEGORIES.map((c) => (
          <button
            key={c.slug}
            className={
              "btn btn-sm " +
              (c.slug === activeCat ? "btn-primary" : "btn-outline-secondary")
            }
            onClick={() => changeCategory(c.slug)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <form className="mb-3" onSubmit={handleSearch}>
        <div className="input-group">
          <input
            name="keyword"
            className="form-control"
            placeholder="Tìm sản phẩm..."
            defaultValue={q}
          />
          <button className="btn btn-primary">Tìm kiếm</button>
        </div>
      </form>

      {loading && <p>Đang tải...</p>}

      {!loading && products.length === 0 && (
        <p className="text-muted">Không có sản phẩm phù hợp.</p>
      )}

      <div className="row g-3">
        {products.map((p) => (
          <div className="col-6 col-md-4 col-lg-3" key={p._id}>
            <div className="card h-100 product-card border-0 shadow-sm">
              <Link
                to={`/products/${p._id}`}
                className="text-decoration-none text-dark"
              >
                <img
                  src={p.thumbnail || p.images?.[0]}
                  alt={p.name}
                  className="card-img-top p-3"
                  style={{ height: 180, objectFit: "contain" }}
                />
                <div className="card-body pt-0">
                  <h6 className="product-name-2line mb-1 text-dark">
                    {p.name}
                  </h6>
                  {p.oldPrice > p.price && (
                    <div className="small text-muted text-decoration-line-through">
                      {p.oldPrice.toLocaleString()} đ
                    </div>
                  )}
                  <div className="fw-bold text-danger mb-1">
                    {p.price.toLocaleString()} đ
                  </div>
                  {p.tags?.includes("hot") && (
                    <span className="badge bg-danger-subtle text-danger me-1">
                      HOT
                    </span>
                  )}
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
  );
}
