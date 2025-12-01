import { useEffect, useState } from "react";
import { userService } from "../../services/userService";
import { authService } from "../../services/authService"; // Để dùng hàm register tạo user
import AdminSidebar from "../../components/admin/AdminSidebar";
import { getImageUrl } from "../../utils/constants";
import { FiTrash2, FiRefreshCw, FiPlus } from "react-icons/fi";
import { useNotification } from "../../context/NotificationContext";
import ConfirmDialog from "../../components/common/ConfirmDialog";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { confirm, notify } = useNotification();
  
  // State cho Modal thêm user
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "user" });

  const load = () => {
    setLoading(true);
    userService.getAll()
      .then(setUsers)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  // Cập nhật quyền (Admin/User/Staff)
  const handleRoleChange = async (id, newRole) => {
    try {
        await userService.updateStatus(id, { role: newRole });
        setUsers(prev => prev.map(u => u._id === id ? { ...u, role: newRole } : u));
        notify("Cập nhật quyền thành công", "success");
    } catch {
        notify("Lỗi cập nhật quyền", "error");
    }
  };

  const handleDelete = (id) => {
    confirm("Xóa người dùng này?", async () => {
        try {
            await userService.delete(id);
            notify("Đã xóa người dùng", "success");
            load();
        } catch { notify("Lỗi xóa người dùng", "error"); }
    });
  }

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
        // Tận dụng API register, sau đó update role ngay lập tức
        const res = await authService.register(newUser); // API register trả về { token, user }
        if (res && res.user) {
            // Nếu role không phải user thường, cần update thêm lần nữa
            if (newUser.role !== 'user') {
                await userService.updateStatus(res.user._id, { role: newUser.role });
            }
            notify("Thêm người dùng thành công", "success");
            setShowModal(false);
            setNewUser({ name: "", email: "", password: "", role: "user" });
            load();
        }
    } catch (err) {
        notify(err.response?.data?.message || "Lỗi tạo người dùng", "error");
    }
  }

  return (
    <div className="d-flex bg-light min-vh-100">
      <AdminSidebar />
      <div className="flex-grow-1 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold m-0">Quản lý người dùng</h4>
            <div className="d-flex gap-2">
                <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}><FiPlus/> Thêm nhân viên/User</button>
                <button className="btn btn-light btn-sm" onClick={load}><FiRefreshCw/> Tải lại</button>
            </div>
        </div>
        
        <div className="card border-0 shadow-sm">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-4">Người dùng</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th className="text-end pe-4">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td className="ps-4">
                    <div className="d-flex align-items-center gap-3">
                        <img src={getImageUrl(u.avatarUrl)} className="rounded-circle border" width="36" height="36" style={{objectFit: "cover"}} alt="" onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png"} />
                        <span className="fw-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="text-muted">{u.email}</td>
                  <td>
                    <select 
                        className={`form-select form-select-sm border-0 fw-bold ${u.role === 'admin' ? 'text-danger' : u.role === 'staff' ? 'text-primary' : 'text-dark'}`}
                        style={{width: 120, cursor: 'pointer'}}
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        disabled={u.role === 'admin'} // Không sửa được admin khác
                    >
                        <option value="user">Khách hàng</option>
                        <option value="staff">Nhân viên</option>
                        <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <span className={`badge ${u.isActive ? 'bg-success' : 'bg-danger'}`}>{u.isActive ? 'Active' : 'Locked'}</span>
                  </td>
                  <td className="text-end pe-4">
                    <button className="btn btn-light text-danger btn-sm" onClick={() => handleDelete(u._id)} disabled={u.role === 'admin'}>
                        <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL THÊM USER */}
      {showModal && (
        <div className="modal d-block" style={{backgroundColor: "rgba(0,0,0,0.5)"}}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow">
                    <div className="modal-header">
                        <h5 className="modal-title">Thêm người dùng mới</h5>
                        <button className="btn-close" onClick={() => setShowModal(false)}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleCreateUser}>
                            <div className="mb-3">
                                <label className="form-label">Họ tên</label>
                                <input className="form-control" required value={newUser.name} onChange={e=>setNewUser({...newUser, name: e.target.value})}/>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input type="email" className="form-control" required value={newUser.email} onChange={e=>setNewUser({...newUser, email: e.target.value})}/>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Mật khẩu</label>
                                <input type="password" className="form-control" required value={newUser.password} onChange={e=>setNewUser({...newUser, password: e.target.value})}/>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Vai trò</label>
                                <select className="form-select" value={newUser.role} onChange={e=>setNewUser({...newUser, role: e.target.value})}>
                                    <option value="user">Khách hàng</option>
                                    <option value="staff">Nhân viên</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <button className="btn btn-primary w-100">Tạo tài khoản</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}