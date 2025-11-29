import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import ConfirmDialog from "../components/ConfirmDialog";

const makeEmptyAddress = (name = "", phone = "") => ({
  index: -1,
  label: "Nhà riêng",
  fullName: name || "",
  phone: phone || "",
  address: "",
  isDefault: false
});

export default function Profile() {
  const { user } = useAuth();
  const [tab, setTab] = useState("info");
  const [profile, setProfile] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    avatarUrl: user?.avatarUrl || ""
  });
  const [addresses, setAddresses] = useState([]);
  const [editingAddress, setEditingAddress] = useState(
    makeEmptyAddress(user?.name, user?.phone)
  );
  const [orders, setOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState("all");
  const [saving, setSaving] = useState(false);
  const [dialog, setDialog] = useState({
    open: false,
    title: "",
    message: ""
  });

  const showDialog = (message, title = "Thông báo") =>
    setDialog({ open: true, title, message });

  useEffect(() => {
    if (!user) return;
    api
      .get("/auth/profile")
      .then((res) => {
        const d = res.data || {};
        setProfile({
          name: d.name || user.name || "",
          phone: d.phone || "",
          avatarUrl: d.avatarUrl || ""
        });
        setAddresses(d.addresses || []);
        setEditingAddress(makeEmptyAddress(d.name || user.name, d.phone || ""));
      })
      .catch((err) => console.error("GET /auth/profile", err));
  }, [user]);

  useEffect(() => {
    if (tab === "orders") {
      api
        .get("/orders/my")
        .then((res) => setOrders(res.data))
        .catch((err) => console.error("GET /orders/my", err));
    }
  }, [tab]);

  const filteredOrders =
    orderFilter === "all"
      ? orders
      : orders.filter((o) => o.status === orderFilter);

  const saveProfile = async () => {
    if (!profile.name.trim() || !profile.phone.trim()) {
      showDialog("Vui lòng nhập đầy đủ họ tên và số điện thoại.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: profile.name,
        phone: profile.phone,
        avatarUrl: profile.avatarUrl,
        addresses
      };
      const res = await api.put("/auth/profile", payload);
      const d = res.data;
      setProfile({
        name: d.name,
        phone: d.phone || "",
        avatarUrl: d.avatarUrl || ""
      });
      setAddresses(d.addresses || []);
      showDialog("Cập nhật thông tin thành công.");
    } catch (e) {
      console.error("PUT /auth/profile", e);
      showDialog(
        e.response?.data?.message || "Lưu thất bại, vui lòng thử lại sau."
      );
    } finally {
      setSaving(false);
    }
  };

  // ===== địa chỉ =====

  const handleAddressChange = (field, value) => {
    setEditingAddress((prev) => ({ ...prev, [field]: value }));
  };

  const saveAddressLocal = () => {
    if (
      !editingAddress.fullName.trim() ||
      !editingAddress.phone.trim() ||
      !editingAddress.address.trim()
    ) {
      showDialog("Vui lòng nhập đầy đủ tên, số điện thoại và địa chỉ.");
      return;
    }

    setAddresses((prev) => {
      let list = [...prev];

      if (editingAddress.isDefault) {
        list = list.map((a) => ({ ...a, isDefault: false }));
      }

      if (editingAddress.index >= 0 && editingAddress.index < list.length) {
        list[editingAddress.index] = {
          label: editingAddress.label,
          fullName: editingAddress.fullName,
          phone: editingAddress.phone,
          address: editingAddress.address,
          isDefault: editingAddress.isDefault
        };
        return list;
      }

      const newAddr = {
        label: editingAddress.label,
        fullName: editingAddress.fullName,
        phone: editingAddress.phone,
        address: editingAddress.address,
        isDefault: editingAddress.isDefault
      };
      return [...list, newAddr];
    });

    setEditingAddress(
      makeEmptyAddress(profile.name || user?.name, profile.phone)
    );
  };

  const startEditAddress = (addr, index) =>
    setEditingAddress({ index, ...addr });

  const setDefaultAddress = (index) => {
    setAddresses((prev) =>
      prev.map((a, i) => ({
        ...a,
        isDefault: i === index
      }))
    );
  };

  const deleteAddress = (index) => {
    setAddresses((prev) => prev.filter((_, i) => i !== index));
  };

  if (!user) return <div className="container mt-3">Vui lòng đăng nhập.</div>;

  const renderOrders = () => (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Quản lý đơn hàng</h5>
        <div className="btn-group order-tabs">
          {["all", "pending", "shipping", "completed", "canceled"].map((st) => (
            <button
              key={st}
              className={
                "btn btn-sm " +
                (orderFilter === st ? "btn-primary" : "btn-light")
              }
              onClick={() => setOrderFilter(st)}
            >
              {st === "all"
                ? "Tất cả"
                : st === "pending"
                ? "Mới"
                : st === "shipping"
                ? "Đang vận chuyển"
                : st === "completed"
                ? "Hoàn thành"
                : "Hủy"}
            </button>
          ))}
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
            <input className="form-control" value={user.email} disabled />
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

          <hr className="my-3" />

          <h6 className="mb-1">Địa chỉ giao hàng</h6>
          <p className="small text-muted">
            Thêm sẵn địa chỉ để chọn nhanh ở bước thanh toán.
          </p>

          <div className="row g-2 mb-2">
            <div className="col-md-4">
              <label className="form-label small mb-1">Nhãn địa chỉ</label>
              <input
                className="form-control form-control-sm"
                value={editingAddress.label}
                onChange={(e) =>
                  handleAddressChange("label", e.target.value)
                }
              />
            </div>
            <div className="col-md-4">
              <label className="form-label small mb-1">Tên người nhận</label>
              <input
                className="form-control form-control-sm"
                value={editingAddress.fullName}
                onChange={(e) =>
                  handleAddressChange("fullName", e.target.value)
                }
              />
            </div>
            <div className="col-md-4">
              <label className="form-label small mb-1">
                Số điện thoại nhận hàng
              </label>
              <input
                className="form-control form-control-sm"
                value={editingAddress.phone}
                onChange={(e) =>
                  handleAddressChange("phone", e.target.value)
                }
              />
            </div>
            <div className="col-12">
              <label className="form-label small mb-1">
                Địa chỉ chi tiết
              </label>
              <input
                className="form-control form-control-sm"
                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                value={editingAddress.address}
                onChange={(e) =>
                  handleAddressChange("address", e.target.value)
                }
              />
            </div>
            <div className="col-12 d-flex align-items-center mt-1">
              <input
                type="checkbox"
                className="form-check-input me-2"
                checked={editingAddress.isDefault}
                id="addr-default"
                onChange={(e) =>
                  handleAddressChange("isDefault", e.target.checked)
                }
              />
              <label
                htmlFor="addr-default"
                className="form-check-label small"
              >
                Đặt làm địa chỉ mặc định
              </label>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={saveAddressLocal}
          >
            {editingAddress.index >= 0 ? "Cập nhật địa chỉ" : "Thêm địa chỉ"}
          </button>

          <div className="vstack gap-2 mt-3">
            {addresses.map((addr, idx) => (
              <div
                key={idx}
                className="border rounded-3 p-2 d-flex justify-content-between align-items-start"
              >
                <div>
                  <div className="fw-semibold small">
                    {addr.label ? `[${addr.label}] ` : ""}
                    {addr.fullName} – {addr.phone}
                  </div>
                  <div className="small text-muted">{addr.address}</div>
                  {addr.isDefault && (
                    <span className="badge bg-primary bg-opacity-75 mt-1">
                      Mặc định
                    </span>
                  )}
                </div>
                <div className="d-flex flex-column gap-1">
                  {!addr.isDefault && (
                    <button
                      type="button"
                      className="btn btn-link p-0 small"
                      onClick={() => setDefaultAddress(idx)}
                    >
                      Đặt mặc định
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-link p-0 small"
                    onClick={() => startEditAddress(addr, idx)}
                  >
                    Sửa
                  </button>
                  <button
                    type="button"
                    className="btn btn-link text-danger p-0 small"
                    onClick={() => deleteAddress(idx)}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
            {addresses.length === 0 && (
              <div className="small text-muted">
                Bạn chưa có địa chỉ nào, hãy thêm địa chỉ mới.
              </div>
            )}
          </div>

          <div className="mt-4">
            <button
              className="btn btn-primary"
              type="button"
              disabled={saving}
              onClick={saveProfile}
            >
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
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
              (profile.name || user.name || "U").charAt(0).toUpperCase()
            )}
          </div>
          <div className="fw-semibold">{profile.name || user.name}</div>
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
            <div className="mb-3">
              <div className="fw-semibold">{profile.name || user.name}</div>
              <div className="small text-muted">{user.email}</div>
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
        open={dialog.open}
        title={dialog.title}
        message={dialog.message}
        confirmText="Đóng"
        onConfirm={() => setDialog({ ...dialog, open: false })}
        onCancel={() => setDialog({ ...dialog, open: false })}
      />
    </div>
  );
}
