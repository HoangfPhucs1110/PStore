import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api";
import ProductCard from "../components/ProductCard";

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategory = searchParams.get("category") || "all";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(urlCategory);
  const [brand, setBrand] = useState("all");
  const [sort, setSort] = useState("newest");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  useEffect(() => {
    setCategory(urlCategory);
  }, [urlCategory]);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError("");

    api
      .get("/products")
      .then((res) => {
        if (ignore) return;
        setProducts(res.data || []);
      })
      .catch((e) => {
        console.error("GET /products", e);
        if (!ignore) setError("Không tải được danh sách sản phẩm.");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.categorySlug).filter(Boolean));
    return ["all", ...Array.from(set)];
  }, [products]);

  const brands = useMemo(() => {
    const set = new Set(products.map((p) => p.brand).filter(Boolean));
    return ["all", ...Array.from(set)];
  }, [products]);

  const filtered = useMemo(() => {
    let list = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q)
      );
    }

    if (category !== "all") {
      list = list.filter((p) => p.categorySlug === category);
    }

    if (brand !== "all") {
      list = list.filter((p) => p.brand === brand);
    }

    if (priceMin !== "") {
      const min = Number(priceMin) || 0;
      list = list.filter((p) => (p.price || 0) >= min);
    }

    if (priceMax !== "") {
      const max = Number(priceMax) || 0;
      if (max > 0) {
        list = list.filter((p) => (p.price || 0) <= max);
      }
    }

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-desc":
        list.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "name-asc":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        list.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "newest":
      default:
        list.sort(
          (a, b) =>
            new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        break;
    }

    return list;
  }, [products, search, category, brand, priceMin, priceMax, sort]);

  const handleCategoryChange = (value) => {
    setCategory(value);
    const next = new URLSearchParams(searchParams);
    if (value === "all") next.delete("category");
    else next.set("category", value);
    setSearchParams(next);
  };

  return (
    <div className="container my-3">
      <div className="row g-3">
        {/* Sidebar filter */}
        <div className="col-12 col-md-3">
          <div className="bg-white rounded-3 shadow-sm p-3">
            <h6 className="mb-3">Bộ lọc sản phẩm</h6>

            <div className="mb-3">
              <label className="form-label small mb-1">
                Tìm kiếm (tên / SKU / hãng)
              </label>
              <input
                className="form-control form-control-sm"
                placeholder="Nhập từ khóa..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label small mb-1">Danh mục</label>
              <select
                className="form-select form-select-sm"
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === "all" ? "Tất cả" : c}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label small mb-1">Thương hiệu</label>
              <select
                className="form-select form-select-sm"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              >
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b === "all" ? "Tất cả" : b}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label small mb-1">
                Khoảng giá (VNĐ)
              </label>
              <div className="d-flex gap-2">
                <input
                  className="form-control form-control-sm"
                  placeholder="Từ"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                />
                <input
                  className="form-control form-control-sm"
                  placeholder="Đến"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label small mb-1">Sắp xếp</label>
              <select
                className="form-select form-select-sm"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
                <option value="name-asc">Tên A → Z</option>
                <option value="name-desc">Tên Z → A</option>
              </select>
            </div>

            <button
              type="button"
              className="btn btn-outline-secondary btn-sm w-100"
              onClick={() => {
                setSearch("");
                setCategory("all");
                setBrand("all");
                setPriceMin("");
                setPriceMax("");
                setSort("newest");
                const next = new URLSearchParams(searchParams);
                next.delete("category");
                setSearchParams(next);
              }}
            >
              Xóa tất cả bộ lọc
            </button>
          </div>
        </div>

        {/* Main list */}
        <div className="col-12 col-md-9">
          <div className="bg-white rounded-3 shadow-sm p-3 mb-3">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
              <h5 className="mb-0">Tất cả sản phẩm</h5>
              <div className="small text-muted">
                Đang hiển thị{" "}
                <strong>{filtered.length}</strong> /{" "}
                <strong>{products.length}</strong> sản phẩm
              </div>
            </div>
          </div>

          {loading && (
            <div className="bg-white rounded-3 shadow-sm p-3">
              Đang tải danh sách sản phẩm...
            </div>
          )}

          {error && !loading && (
            <div className="bg-white rounded-3 shadow-sm p-3 text-danger">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="row g-3">
              {filtered.length === 0 && (
                <div className="col-12">
                  <div className="bg-white rounded-3 shadow-sm p-3 text-muted small">
                    Không tìm thấy sản phẩm phù hợp với bộ lọc hiện tại.
                  </div>
                </div>
              )}

              {filtered.map((p) => (
                <div className="col-6 col-md-4 col-xl-3" key={p._id}>
                  <ProductCard p={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
