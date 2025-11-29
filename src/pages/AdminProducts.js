import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import ConfirmDialog from "../components/ConfirmDialog";

export default function AdminProducts() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterBrand, setFilterBrand] = useState("all");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/products");
      setList(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Không tải được danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const categories = useMemo(() => {
    const set = new Set(list.map((p) => p.categorySlug).filter(Boolean));
    return Array.from(set);
  }, [list]);

  const brands = useMemo(() => {
    const set = new Set(list.map((p) => p.brand).filter(Boolean));
    return Array.from(set);
  }, [list]);

  const filtered = useMemo(() => {
    return list.filter((p) => {
      if (
        search &&
        !p.name.toLowerCase().includes(search.toLowerCase()) &&
        !p.sku?.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      if (filterCategory !== "all" && p.categorySlug !== filterCategory)
        return false;
      if (filterBrand !== "all" && p.brand !== filterBrand) return false;
      return true;
    });
  }, [list, search, filterCategory, filterBrand]);

  const askRemove = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const doRemove = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/products/${deleteId}`);
      setList((prev) => prev.filter((p) => p._id !== deleteId));
    } catch (err) {
      console.error(err);
      alert("Xóa thất bại");
    } finally {
      setDeleteId(null);
      setConfirmOpen(false);
    }
  };

  const toggleFeatured = async (id, current) => {
    try {
      await api.put(`/products/${id}`, { isFeatured: !current });
      setList((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, isFeatured: !current } : p
        )
      );
    } catch (err) {
      console.error(err);
      alert("Không cập nhật được trạng thái nổi bật");
    }
  };

  return (
    <div className="container py-4">
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
              onClick={() => {
                setSearch("");
                setFilterCategory("all");
                setFilterBrand("all");
              }}
            >
              Xóa bộ lọc
            </button>
            <button className="btn btn-outline-primary btn-sm" onClick={load}>
              Tải lại danh sách
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body p-0">
          {loading ? (
            <div className="p-3 text-center">Đang tải...</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: 60 }}>STT</th>
                    <th style={{ width: 80 }}>Ảnh</th>
                    <th>Tên sản phẩm</th>
                    <th>SKU</th>
                    <th>Danh mục</th>
                    <th>Thương hiệu</th>
                    <th className="text-end">Giá bán</th>
                    <th className="text-center" style={{ width: 90 }}>
                      Tồn kho
                    </th>
                    <th className="text-center" style={{ width: 110 }}>
                      Nổi bật
                    </th>
                    <th style={{ width: 160 }} className="text-center">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={10} className="text-center py-3">
                        Không có sản phẩm nào phù hợp.
                      </td>
                    </tr>
                  )}

                  {filtered.map((p, index) => {
                    const thumb =
                      p.images && p.images.length > 0 ? p.images[0] : null;
                    const stock = p.stock ?? 0;
                    const out = stock <= 0;

                    return (
                      <tr key={p._id}>
                        <td>{index + 1}</td>
                        <td>
                          {thumb ? (
                            <img
                              src={thumb}
                              alt={p.name}
                              style={{
                                width: 60,
                                height: 60,
                                objectFit: "cover",
                                borderRadius: 4
                              }}
                            />
                          ) : (
                            <div
                              className="bg-light border d-flex align-items-center justify-content-center"
                              style={{
                                width: 60,
                                height: 60,
                                borderRadius: 4,
                                fontSize: 12
                              }}
                            >
                              No image
                            </div>
                          )}
                        </td>
                        <td>
                          <div className="fw-semibold">{p.name}</div>
                          <div className="text-muted small">
                            {p.isNew && (
                              <span className="badge bg-success me-1">
                                New
                              </span>
                            )}
                            {p.isFeatured && (
                              <span className="badge bg-warning text-dark me-1">
                                Featured
                              </span>
                            )}
                            {out && (
                              <span className="badge bg-secondary">
                                Hết hàng
                              </span>
                            )}
                          </div>
                        </td>
                        <td>{p.sku}</td>
                        <td>{p.categorySlug}</td>
                        <td>{p.brand}</td>
                        <td className="text-end">
                          {p.price?.toLocaleString("vi-VN")} đ
                        </td>
                        <td className="text-center">{stock}</td>
                        <td className="text-center">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={!!p.isFeatured}
                            onChange={() =>
                              toggleFeatured(p._id, !!p.isFeatured)
                            }
                          />
                        </td>
                        <td className="text-center">
                          <div className="btn-group btn-group-sm">
                            <Link
                              to={`/admin/products/${p._id}/edit`}
                              className="btn btn-outline-primary"
                            >
                              Sửa
                            </Link>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => askRemove(p._id)}
                            >
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Xóa sản phẩm"
        message="Bạn có chắc chắn muốn xóa sản phẩm này? Hành động không thể hoàn tác."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={doRemove}
      />
    </div>
  );
}
