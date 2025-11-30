import { Link } from "react-router-dom";

export default function AdminProductFilters({
  search,
  setSearch,
  filterCategory,
  setFilterCategory,
  filterBrand,
  setFilterBrand,
  categories,
  brands,
  onReset,
  onReload
}) {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center">
          <button
            className="btn btn-light me-2"
            onClick={() => (window.location.href = "/admin")}
          >
            ← Quay lại trang Admin
          </button>
          <h3 className="mb-0">Quản lý sản phẩm</h3>
        </div>
        <Link to="/admin/products/new" className="btn btn-primary">
          + Thêm sản phẩm
        </Link>
      </div>

      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-2">
            <div className="col-md-4">
              <label className="form-label mb-1">Tìm kiếm (tên / SKU)</label>
              <input
                className="form-control"
                placeholder="Nhập tên hoặc mã sản phẩm..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label mb-1">Lọc theo danh mục</label>
              <select
                className="form-select"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">Tất cả</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label mb-1">Lọc theo thương hiệu</label>
              <select
                className="form-select"
                value={filterBrand}
                onChange={(e) => setFilterBrand(e.target.value)}
              >
                <option value="all">Tất cả</option>
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-3 d-flex gap-2">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={onReset}
            >
              Xóa bộ lọc
            </button>
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={onReload}
            >
              Tải lại danh sách
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
