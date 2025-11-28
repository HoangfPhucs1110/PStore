import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import ConfirmDialog from "../components/ConfirmDialog";

export default function Profile() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("info");
  const [profile, setProfile] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    avatarUrl: user?.avatarUrl || ""
  });
  const [orders, setOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState("all");
  const [confirm, setConfirm] = useState({
    type: "",
    open: false,
    payload: null
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (tab === "orders") {
      api.get("/orders/my").then((res) => setOrders(res.data));
    }
  }, [tab]);

  const filteredOrders =
    orderFilter === "all"
      ? orders
      : orders.filter((o) => o.status === orderFilter);

  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await api.put("/auth/profile", profile);
      setProfile({
        name: res.data.name,
        phone: res.data.phone || "",
        avatarUrl: res.data.avatarUrl || ""
      });
      setConfirm({
        type: "infoSaved",
        open: true,
        payload: null
      });
    } catch (e) {
      setConfirm({
        type: "error",
        open: true,
        payload: e.response?.data?.message || "Lưu thất bại"
      });
    } finally {
      setSaving(false);
    }
  };

  const askSave = () =>
    setConfirm({ type: "saveInfo", open: true, payload: null });

  const handleLogout = () =>
    setConfirm({ type: "logout", open: true, payload: null });

  const handleConfirm = async () => {
    if (confirm.type === "saveInfo") {
      setConfirm({ ...confirm, open: false });
      await saveProfile();
    } else if (confirm.type === "logout") {
      setConfirm({ ...confirm, open: false });
      logout();
    } else {
      setConfirm({ ...confirm, open: false });
    }
  };

  if (!user) return <div className="container mt-3">Vui lòng đăng nhập.</div>;

  const renderOrders = () => (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Quản lý đơn hàng</h5>
        <div className="btn-group order-tabs">
          <button
            className={
              "btn btn-sm " + (orderFilter === "all" ? "btn-primary" : "btn-light")
            }
            onClick={() => setOrderFilter("all")}
          >
            Tất cả
          </button>
          <button
            className={
              "btn btn-sm " +
              (orderFilter === "pending" ? "btn-primary" : "btn-light")
            }
            onClick={() => setOrderFilter("pending")}
          >
            Mới
          </button>
          <button
            className={
              "btn btn-sm " +
              (orderFilter === "shipping" ? "btn-primary" : "btn-light")
            }
            onClick={() => setOrderFilter("shipping")}
          >
            Đang vận chuyển
          </button>
          <button
            className={
              "btn btn-sm " +
              (orderFilter === "completed" ? "btn-primary" : "btn-light")
            }
            onClick={() => setOrderFilter("completed")}
          >
            Hoàn thành
          </button>
          <button
            className={
              "btn btn-sm " +
              (orderFilter === "canceled" ? "btn-primary" : "btn-light")
            }
            onClick={() => setOrderFilter("canceled")}
          >
            Hủy
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 && (
        <p className="text-muted small mb-0">
          Chưa có đơn hàng nào với trạng thái này.
        </p>
      )}

      <div className="vstack gap-2">
        {filteredOrders.map((o) => (
          <div
            key={o._id}
            className="border rounded-3 p-3 d-flex justify-content-between align-items-center bg-white"
          >
            <div>
              <div className="fw-semibold">
                Mã đơn: <span className="text-primary">{o._id}</span>
              </div>
              <div className="small text-muted">
                {new Date(o.createdAt).toLocaleString()}
              </div>
              <div className="small">
                {o.items.map((i) => i.nameSnapshot).join(", ")}
              </div>
            </div>
            <div className="text-end">
              <div className="fw-semibold text-danger">
                {o.total.toLocaleString()} đ
              </div>
              <div className="small">
                {o.status === "pending" && (
                  <span className="badge bg-warning text-dark">Mới</span>
                )}
                {o.status === "shipping" && (
                  <span className="badge bg-info text-dark">
                    Đang vận chuyển
                  </span>
                )}
                {o.status === "completed" && (
                  <span className="badge bg-success">Hoàn thành</span>
                )}
                {o.status === "canceled" && (
                  <span className="badge bg-secondary">Đã hủy</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const renderInfo = () => (
    <>
      <h5 className="mb-3">Thông tin tài khoản</h5>
      <div className="row g-3">
        <div className="col-md-8">
          <div className="mb-3">
            <label className="form-label">Họ tên</label>
            <input
              className="form-control"
              value={profile.name}
              onChange={(e) =>
                setProfile({ ...profile, name: e.target.value })
              }
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              className="form-control"
              value={user.email}
              disabled
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Số điện thoại</label>
            <input
              className="form-control"
              value={profile.phone}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Ảnh đại diện (URL)</label>
            <input
              className="form-control"
              value={profile.avatarUrl}
              onChange={(e) =>
                setProfile({ ...profile, avatarUrl: e.target.value })
              }
            />
          </div>
          <button
            className="btn btn-primary"
            type="button"
            disabled={saving}
            onClick={askSave}
          >
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
        <div className="col-md-4 d-flex flex-column align-items-center">
          <div
            className="rounded-circle mb-2"
            style={{
              width: 96,
              height: 96,
              background: "#e5f0ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              fontSize: 36,
              fontWeight: 700,
              color: "#0d6efd"
            }}
          >
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              (user.name || "U").charAt(0).toUpperCase()
            )}
          </div>
          <div className="fw-semibold">{user.name}</div>
          <div className="small text-muted">{user.email}</div>
        </div>
      </div>
    </>
  );

  return (
    <div className="container my-3 account-page">
      <div className="row g-3">
        <div className="col-md-3">
          <div className="bg-white rounded-3 shadow-sm p-3">
            <div className="d-flex align-items-center mb-3">
              <div className="avatar-circle me-2">
                {(user.name || "U").charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="fw-semibold">{user.name}</div>
                <div className="small text-muted">{user.email}</div>
              </div>
            </div>
            <div className="vstack gap-2">
              <button
                className={
                  "account-menu-btn " + (tab === "info" ? "active" : "")
                }
                onClick={() => setTab("info")}
              >
                Thông tin tài khoản
              </button>
              <button
                className={
                  "account-menu-btn " + (tab === "orders" ? "active" : "")
                }
                onClick={() => setTab("orders")}
              >
                Quản lý đơn hàng
              </button>
              <button
                className="account-menu-btn text-danger"
                onClick={handleLogout}
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-9">
          <div className="bg-white rounded-3 shadow-sm p-3">
            {tab === "info" && renderInfo()}
            {tab === "orders" && renderOrders()}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirm.open}
        title={
          confirm.type === "logout"
            ? "Đăng xuất"
            : confirm.type === "saveInfo"
            ? "Lưu thay đổi"
            : "Thông báo"
        }
        message={
          confirm.type === "logout"
            ? "Bạn muốn thoát tài khoản?"
            : confirm.type === "saveInfo"
            ? "Bạn muốn lưu thay đổi?"
            : confirm.type === "infoSaved"
            ? "Cập nhật thông tin thành công"
            : confirm.type === "error"
            ? confirm.payload
            : ""
        }
        confirmText={
          confirm.type === "infoSaved" || confirm.type === "error"
            ? "Đóng"
            : "Đồng ý"
        }
        cancelText={
          confirm.type === "logout" || confirm.type === "saveInfo"
            ? "Không"
            : ""
        }
        onConfirm={handleConfirm}
        onCancel={() => setConfirm({ ...confirm, open: false })}
      />
    </div>
  );
}
