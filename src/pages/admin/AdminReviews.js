import { useEffect, useState } from "react";
import { reviewService } from "../../services/reviewService";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { getImageUrl } from "../../utils/constants";
import { FiTrash2, FiStar } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useNotification } from "../../context/NotificationContext"; // <--- IMPORT

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { confirm, notify } = useNotification(); // <--- HOOK

  const load = () => {
    setLoading(true);
    reviewService.getAllAdmin()
      .then(setReviews)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = (id) => {
    confirm("Bạn có chắc muốn xóa đánh giá này? Điểm đánh giá của sản phẩm sẽ được tính lại.", async () => {
      try {
        await reviewService.deleteAdmin(id);
        notify("Đã xóa đánh giá thành công", "success");
        load();
      } catch {
        notify("Lỗi khi xóa đánh giá", "error");
      }
    });
  };

  return (
    <div className="d-flex bg-light min-vh-100">
      <AdminSidebar />
      <div className="flex-grow-1 p-4">
        <h4 className="fw-bold mb-4">Quản lý đánh giá</h4>

        <div className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Sản phẩm</th>
                  <th>Khách hàng</th>
                  <th>Đánh giá</th>
                  <th style={{width: "40%"}}>Nội dung</th>
                  <th>Ngày</th>
                  <th className="text-end pe-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-4">Đang tải...</td></tr>
                ) : reviews.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-4 text-muted">Chưa có đánh giá nào.</td></tr>
                ) : reviews.map(r => (
                  <tr key={r._id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center gap-2">
                        {r.product ? (
                            <>
                                <img src={getImageUrl(r.product.thumbnail)} width="40" height="40" className="rounded border object-fit-cover" alt="" onError={(e)=>e.target.src="https://via.placeholder.com/40"}/>
                                <Link to={`/products/${r.product.slug}`} className="text-decoration-none text-dark fw-medium text-truncate" style={{maxWidth: 150}} target="_blank">
                                    {r.product.name}
                                </Link>
                            </>
                        ) : <span className="text-danger small">(Sản phẩm đã xóa)</span>}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="bg-light rounded-circle d-flex align-items-center justify-content-center text-primary fw-bold" style={{width: 32, height: 32}}>
                            {r.user?.name?.charAt(0) || "U"}
                        </div>
                        <div className="small">
                            <div className="fw-medium">{r.user?.name || "Ẩn danh"}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                        <div className="d-flex text-warning">
                            {[...Array(5)].map((_, i) => (
                                <FiStar key={i} size={14} fill={i < r.rating ? "currentColor" : "none"} />
                            ))}
                        </div>
                    </td>
                    <td><div className="text-wrap small text-secondary">{r.comment}</div></td>
                    <td className="text-muted small">{new Date(r.createdAt).toLocaleDateString("vi-VN")}</td>
                    <td className="text-end pe-4">
                      <button onClick={() => handleDelete(r._id)} className="btn btn-light btn-sm text-danger" title="Xóa đánh giá">
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}