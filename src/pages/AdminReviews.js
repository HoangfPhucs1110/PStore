// frontend/src/pages/AdminReviews.js
import { useEffect, useState } from "react";
import api from "../api";
import { FaTrash, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const buildAvatarUrl = (u = {}) => {
  const raw = u.avatar || u.avatarUrl || u.photo || u.image;
  if (!raw) return null;
  if (raw.startsWith("http")) return raw;
  const base = process.env.REACT_APP_API_URL || "http://localhost:5000";
  return `${base}${raw.startsWith("/") ? "" : "/"}${raw}`;
};

export default function AdminReviews() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/admin/reviews");
      setList(data || []);
    } catch (err) {
      console.error(err);
      alert("Không tải được danh sách đánh giá");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    if (!window.confirm("Xóa đánh giá này?")) return;
    try {
      await api.delete(`/admin/reviews/${id}`);
      setList((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
      alert("Không xóa được đánh giá");
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Quản lý đánh giá sản phẩm</h3>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => nav("/admin")}
        >
          ← Quay lại trang Admin
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          {loading ? (
            <div className="text-center py-3 small text-muted">
              Đang tải dữ liệu...
            </div>
          ) : list.length === 0 ? (
            <div className="text-center py-3 small text-muted">
              Chưa có đánh giá nào.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Người dùng</th>
                    <th style={{ width: 220 }}>Sản phẩm</th>
                    <th style={{ width: 120 }}>Số sao</th>
                    <th>Nội dung</th>
                    <th style={{ width: 170 }}>Thời gian</th>
                    <th style={{ width: 60 }} className="text-center">
                      Xóa
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((r) => {
                    const u = r.user || {};
                    const p = r.product || {};
                    const avatarUrl = buildAvatarUrl(u);

                    return (
                      <tr key={r._id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            {avatarUrl ? (
                              <img
                                src={avatarUrl}
                                alt={u.name}
                                style={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                }}
                                onError={(e) => (e.target.style.display = "none")}
                              />
                            ) : (
                              <div
                                className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                                style={{
                                  width: 32,
                                  height: 32,
                                  fontSize: 12,
                                }}
                              >
                                {u.name ? u.name[0].toUpperCase() : "?"}
                              </div>
                            )}
                            <div>
                              <div className="fw-semibold">
                                {u.name || "Unknown"}
                              </div>
                              <div className="small text-muted">
                                {u.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="fw-semibold small">{p.name}</div>
                          {p.slug && (
                            <button
                              className="btn btn-link p-0 small"
                              onClick={() => nav(`/product/${p.slug}`)}
                            >
                              Xem sản phẩm
                            </button>
                          )}
                        </td>

                        <td>
                          <div className="d-flex align-items-center gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <FaStar
                                key={s}
                                size={14}
                                style={{
                                  color: s <= r.rating ? "#f4b400" : "#ddd",
                                }}
                              />
                            ))}
                          </div>
                        </td>

                        <td className="small">{r.comment}</td>

                        <td className="small text-muted">
                          {new Date(r.createdAt).toLocaleString("vi-VN")}
                        </td>

                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => remove(r._id)}
                          >
                            <FaTrash size={14} />
                          </button>
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
    </div>
  );
}
