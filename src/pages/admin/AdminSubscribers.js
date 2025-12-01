import { useEffect, useState } from "react";
import { subscriberService } from "../../services/subscriberService";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { FiTrash2, FiMail, FiRefreshCw } from "react-icons/fi";
import { useNotification } from "../../context/NotificationContext";

export default function AdminSubscribers() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { confirm, notify } = useNotification();

  const load = () => {
    setLoading(true);
    subscriberService.getAll()
      .then(setList)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = (id) => {
    confirm("Bạn có chắc muốn xóa email này khỏi danh sách nhận tin?", async () => {
      try {
        await subscriberService.delete(id);
        notify("Đã xóa thành công", "success");
        load();
      } catch {
        notify("Lỗi khi xóa", "error");
      }
    });
  };

  return (
    <div className="d-flex bg-light min-vh-100">
      <AdminSidebar />
      <div className="flex-grow-1 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold m-0">Email Marketing</h4>
            <button className="btn btn-light btn-sm" onClick={load}><FiRefreshCw/> Tải lại</button>
        </div>
        
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white py-3">
            <h6 className="m-0 fw-bold text-primary">Danh sách đăng ký ({list.length})</h6>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Email</th>
                  <th>Ngày đăng ký</th>
                  <th className="text-end pe-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="3" className="text-center py-4">Đang tải...</td></tr>
                ) : list.length === 0 ? (
                  <tr><td colSpan="3" className="text-center py-4 text-muted">Chưa có ai đăng ký nhận tin.</td></tr>
                ) : list.map((sub) => (
                  <tr key={sub._id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center gap-2">
                          <div className="bg-primary-subtle rounded p-2 text-primary"><FiMail /></div>
                          <span className="fw-medium text-dark">{sub.email}</span>
                      </div>
                    </td>
                    <td className="text-muted small">
                      {new Date(sub.createdAt).toLocaleString("vi-VN")}
                    </td>
                    <td className="text-end pe-4">
                      <button className="btn btn-light text-danger btn-sm" onClick={() => handleDelete(sub._id)} title="Xóa">
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