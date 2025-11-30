import { Link } from "react-router-dom";

export default function AdminProductTable({
  products,
  loading,
  onToggleFeatured,
  onAskDelete
}) {
  return (
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
                {products.length === 0 && (
                  <tr>
                    <td colSpan={10} className="text-center py-3">
                      Không có sản phẩm nào phù hợp.
                    </td>
                  </tr>
                )}

                {products.map((p, index) => {
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
                            <span className="badge bg-success me-1">New</span>
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
                            onToggleFeatured(p._id, !!p.isFeatured)
                          }
                        />
                      </td>
                      <td className="text-center">
                        <div className="btn-group btn-group-sm">
                          <Link
                            to={`/admin/products/${p._id}`}
                            className="btn btn-sm btn-outline-primary"
                          >
                            Sửa
                          </Link>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              onAskDelete(p._id);
                            }}
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
  );
}
