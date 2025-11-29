import { useEffect, useMemo, useState } from "react";
import api from "../api";
import ConfirmDialog from "../components/ConfirmDialog";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/users"); // ĐÚNG URL: /api/admin/users
      setUsers(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (
        search &&
        !u.name?.toLowerCase().includes(search.toLowerCase()) &&
        !u.email?.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      return true;
    });
  }, [users, search, roleFilter]);

  const askDelete = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/admin/users/${deleteId}`);
      setUsers((prev) => prev.filter((u) => u._id !== deleteId));
    } catch (e) {
      console.error(e);
    } finally {
      setConfirmOpen(false);
      setDeleteId(null);
    }
  };

  const changeRole = async (userId, role) => {
    try {
      const res = await api.patch(`/admin/users/${userId}`, { role });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: res.data.role } : u))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const toggleActive = async (user) => {
    try {
      const res = await api.patch(`/admin/users/${user._id}`, {
        isActive: !user.isActive
      });
      setUsers((prev) =>
        prev.map((u) =>
          u._id === user._id ? { ...u, isActive: res.data.isActive } : u
        )
      );
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="container py-4">
        <button
  className="btn btn-light mb-3"
  onClick={() => (window.location.href = "/admin")}
>
  ← Quay lại trang Admin
</button>

      <div className="d-flex justify-content-between mb-3">
        <h3 className="mb-0">Quản lý người dùng</h3>
        <button className="btn btn-outline-primary btn-sm" onClick={load}>
          Tải lại
        </button>
      </div>

      {/* Bộ lọc */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-2">
            <div className="col-md-6">
              <label className="form-label mb-1">Tìm theo tên / email</label>
              <input
                className="form-control form-control-sm"
                placeholder="Nhập tên hoặc email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label mb-1">Lọc theo quyền</label>
              <select
                className="form-select form-select-sm"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">Tất cả</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <button
                className="btn btn-outline-secondary btn-sm w-100"
                onClick={() => {
                  setSearch("");
                  setRoleFilter("all");
                }}
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bảng user */}
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
                    <th>Tên</th>
                    <th>Email</th>
                    <th>SĐT</th>
                    <th>Quyền</th>
                    <th>Trạng thái</th>
                    <th style={{ width: 160 }} className="text-center">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-3">
                        Chưa có người dùng.
                      </td>
                    </tr>
                  )}

                  {filteredUsers.map((u, index) => (
                    <tr key={u._id}>
                      <td>{index + 1}</td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.phone}</td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={u.role}
                          onChange={(e) => changeRole(u._id, e.target.value)}
                          disabled={u._id === u.currentUserId} // nếu muốn khoá sửa chính mình thì truyền thêm prop
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>
                        <span
                          className={
                            u.isActive
                              ? "badge bg-success"
                              : "badge bg-secondary"
                          }
                          style={{ cursor: "pointer" }}
                          onClick={() => toggleActive(u)}
                        >
                          {u.isActive ? "Đang hoạt động" : "Đã khóa"}
                        </span>
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => askDelete(u._id)}
                          disabled={u.role === "admin"}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Xóa người dùng"
        message="Bạn có chắc chắn muốn xóa tài khoản này? Hành động không thể hoàn tác."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
