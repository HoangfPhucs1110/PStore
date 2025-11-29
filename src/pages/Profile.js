import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import ConfirmDialog from "../components/ConfirmDialog";
import { useLocation } from "react-router-dom";

const apiBase =
  api.defaults.baseURL?.replace(/\/api\/?$/, "") || window.location.origin;

const makeEmptyAddress = (name = "", phone = "") => ({
  index: -1,
  label: "Nhà riêng",
  fullName: name || "",
  phone: phone || "",
  address: "",
  isDefault: false
});

const formatMoney = (n) => {
  const num = typeof n === "number" ? n : Number(n || 0);
  return num.toLocaleString();
};

const normalizeAvatar = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return apiBase + url;
};

export default function Profile() {
  const { user } = useAuth();
  const location = useLocation();
const searchParams = new URLSearchParams(location.search);
const initialTab = searchParams.get("tab") || "info";
const [tab, setTab] = useState(initialTab);

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
  const [avatarUploading, setAvatarUploading] = useState(false);

  const [dialog, setDialog] = useState({
    open: false,
    title: "",
    message: "",
    confirmText: "Đồng ý",
    cancelText: "Hủy",
    onConfirm: null
  });

  const fileInputRef = useRef(null);

  const showAlert = (message, title = "Thông báo") =>
    setDialog({
      open: true,
      title,
      message,
      confirmText: "Đóng",
      cancelText: "Đóng",
      onConfirm: null
    });

  const showConfirm = (message, onConfirm, title = "Xác nhận") =>
    setDialog({
      open: true,
      title,
      message,
      confirmText: "Xóa",
      cancelText: "Hủy",
      onConfirm
    });

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
        setAddresses(Array.isArray(d.addresses) ? d.addresses : []);
        setEditingAddress(makeEmptyAddress(d.name || user.name, d.phone || ""));
      })
      .catch((err) => console.error("GET /auth/profile", err));
  }, [user]);

  useEffect(() => {
    if (tab === "orders") {
      api
        .get("/orders/my")
        .then((res) => setOrders(res.data || []))
        .catch((err) => console.error("GET /orders/my", err));
    }
  }, [tab]);

  const filteredOrders =
    orderFilter === "all"
      ? orders
      : orders.filter((o) => o.status === orderFilter);

  const saveProfile = async () => {
    if (!profile.name.trim() || !profile.phone.trim()) {
      showAlert("Vui lòng nhập đầy đủ họ tên và số điện thoại.");
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
      const d = res.data || {};
      setProfile({
        name: d.name || profile.name,
        phone: d.phone || profile.phone,
        avatarUrl: d.avatarUrl || profile.avatarUrl
      });
      if (Array.isArray(d.addresses)) {
        setAddresses(d.addresses);
      }
      showAlert("Cập nhật thông tin thành công.");
    } catch (e) {
      console.error("PUT /auth/profile", e);
      showAlert(
        e.response?.data?.message || "Lưu thất bại, vui lòng thử lại sau."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setAvatarUploading(true);
    try {
      const fd = new FormData();
      fd.append("avatar", file);
      const res = await api.post("/auth/profile/avatar", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const url = res.data?.avatarUrl || "";
      if (url) {
        setProfile((prev) => ({ ...prev, avatarUrl: url }));
        showAlert("Cập nhật ảnh đại diện thành công.");
      }
    } catch (err) {
      console.error("POST /auth/profile/avatar", err);
      showAlert(
        err.response?.data?.message ||
          "Tải ảnh thất bại, vui lòng thử lại sau."
      );
    } finally {
      setAvatarUploading(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleAddressChange = (field, value) => {
    setEditingAddress((prev) => ({ ...prev, [field]: value }));
  };

  const saveAddressLocal = () => {
    if (
      !editingAddress.fullName.trim() ||
      !editingAddress.phone.trim() ||
      !editingAddress.address.trim()
    ) {
      showAlert("Vui lòng nhập đầy đủ tên, số điện thoại và địa chỉ.");
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
      } else {
        const newAddr = {
          label: editingAddress.label,
          fullName: editingAddress.fullName,
          phone: editingAddress.phone,
          address: editingAddress.address,
          isDefault: editingAddress.isDefault
        };
        list = [...list, newAddr];
      }

      return list;
    });

    setEditingAddress(
      makeEmptyAddress(profile.name || user?.name, profile.phone)
    );
  };

  const startEditAddress = (index) => {
    const a = addresses[index];
    if (!a) return;
    setEditingAddress({
      index,
      label: a.label || "Nhà riêng",
      fullName: a.fullName || profile.name || user?.name || "",
      phone: a.phone || profile.phone || "",
      address: a.address || "",
      isDefault: !!a.isDefault
    });
  };

  const deleteAddress = (index) => {
    showConfirm("Bạn có chắc muốn xóa địa chỉ này?", () => {
      setAddresses((prev) => prev.filter((_, i) => i !== index));
    });
  };

  const setDefaultAddress = (index) => {
    setAddresses((prev) =>
      prev.map((a, i) => ({ ...a, isDefault: i === index }))
    );
  };

  if (!user)
    return <div className="container mt-3">Vui lòng đăng nhập.</div>;

  const avatarSidebarSrc = normalizeAvatar(profile.avatarUrl);

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
                ? "Chờ xác nhận"
                : st === "shipping"
                ? "Đang giao"
                : st === "completed"
                ? "Hoàn thành"
                : "Đã hủy"}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-muted small">Bạn chưa có đơn hàng nào.</div>
      )}

      <div className="vstack gap-3">
        {filteredOrders.map((o) => (
          <div
            key={o._id}
            className="border rounded-3 p-3 bg-white d-flex flex-column flex-md-row justify-content-between gap-2"
          >
            <div>
              <div className="fw-semibold mb-1">
                Đơn #{(o._id || "").slice(-6).toUpperCase()}
              </div>
              <div className="small text-muted mb-1">
                Ngày đặt:{" "}
                {o.createdAt ? new Date(o.createdAt).toLocaleString() : ""}
              </div>
              <div className="small mb-1">
                Người nhận: {o.shippingInfo?.fullName} –{" "}
                {o.shippingInfo?.phone}
              </div>
              <div className="small text-muted mb-1">
                Địa chỉ: {o.shippingInfo?.address}
              </div>
              <div className="small">
                Sản phẩm:{" "}
                {Array.isArray(o.items)
                  ? o.items
                      .map(
                        (it) =>
                          `${it.nameSnapshot} x ${it.qty} (${formatMoney(
                            it.priceSnapshot
                          )}đ)`
                      )
                      .join("; ")
                  : ""}
              </div>

              <div className="small text-muted mb-1">
  Ghi chú: {o.note?.trim() ? o.note : "Không có"}
</div>
            </div>
            <div className="text-md-end">
              <div className="fw-semibold mb-1 text-danger">
                {formatMoney(o.total)} đ
              </div>
              <div className="small mb-1">
                Thanh toán: {o.paymentMethod || "COD"} –{" "}
                {o.paymentStatus === "paid"
                  ? "Đã thanh toán"
                  : o.paymentStatus === "refunded"
                  ? "Đã hoàn tiền"
                  : "Chưa thanh toán"}
              </div>
              <div>
                {o.status === "pending" && (
                  <span className="badge bg-warning text-dark">
                    Chờ xác nhận
                  </span>
                )}
                {o.status === "shipping" && (
                  <span className="badge bg-info text-dark">Đang vận chuyển</span>
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

  const avatarMainSrc = normalizeAvatar(profile.avatarUrl);

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

          <button
            className="btn btn-primary"
            type="button"
            disabled={saving}
            onClick={saveProfile}
          >
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>

        <div className="col-md-4 d-flex flex-column align-items-center">
          <div
            className="rounded-circle mb-2 border position-relative"
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
              color: "#0d6efd",
              cursor: "pointer"
            }}
            onClick={handleAvatarClick}
          >
            {avatarMainSrc ? (
              <img
                src={avatarMainSrc}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/96?text=Avatar";
                }}
              />
            ) : (
              (profile.name || user.name || "U").charAt(0).toUpperCase()
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="d-none"
            onChange={handleAvatarChange}
          />
          <div className="fw-semibold">{profile.name || user.name}</div>
          <div className="small text-muted mb-1">{user.email}</div>
          <div className="small text-primary">
            {avatarUploading ? "Đang tải ảnh..." : "Nhấn vào ảnh để đổi ảnh"}
          </div>
        </div>
      </div>
    </>
  );

  const renderAddresses = () => (
    <>
      <h5 className="mb-3">Địa chỉ giao hàng</h5>
      <p className="small text-muted">
        Thêm sẵn địa chỉ để chọn nhanh ở bước thanh toán.
      </p>

      <div className="row g-3">
        <div className="col-md-7">
          <div className="bg-light rounded-3 p-3">
            <h6 className="mb-2">
              {editingAddress.index >= 0 ? "Sửa địa chỉ" : "Thêm địa chỉ mới"}
            </h6>

            <div className="row g-2">
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
              className="btn btn-outline-primary btn-sm mt-3"
              onClick={saveAddressLocal}
            >
              {editingAddress.index >= 0 ? "Cập nhật địa chỉ" : "Thêm địa chỉ"}
            </button>
          </div>
        </div>

        <div className="col-md-5">
          <div className="vstack gap-2">
            {addresses.map((addr, idx) => (
              <div
                key={idx}
                className="border rounded-3 p-2 d-flex justify-content-between align-items-start"
              >
                <div>
                  <div className="fw-semibold small">
                    {addr.label ? `[${addr.label}] ` : ""}
                    {addr.fullName} – {addr.phone}
                    {addr.isDefault && (
                      <span className="badge bg-primary ms-2">Mặc định</span>
                    )}
                  </div>
                  <div className="small text-muted">{addr.address}</div>
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
                    onClick={() => startEditAddress(idx)}
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
              {saving ? "Đang lưu..." : "Lưu thay đổi địa chỉ"}
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="container my-3">
      <div className="row g-3">
        <div className="col-md-3">
          <div className="bg-white rounded-3 shadow-sm p-3 h-100 d-flex flex-column">
            <div className="d-flex align-items-center mb-3">
              <div
                className="rounded-circle me-2"
                style={{
                  width: 40,
                  height: 40,
                  background: "#e5f0ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#0d6efd"
                }}
              >
                {avatarSidebarSrc ? (
                  <img
                    src={avatarSidebarSrc}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/40?text=U";
                    }}
                  />
                ) : (
                  (profile.name || user.name || "U").charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <div className="fw-semibold small">
                  {profile.name || user.name}
                </div>
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
                  "account-menu-btn " + (tab === "addresses" ? "active" : "")
                }
                onClick={() => setTab("addresses")}
              >
                Địa chỉ giao hàng
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
            {tab === "addresses" && renderAddresses()}
            {tab === "orders" && renderOrders()}
          </div>
        </div>
      </div>

      <ConfirmDialog
        show={dialog.open}
        title={dialog.title}
        message={dialog.message}
        confirmText={dialog.confirmText}
        cancelText={dialog.cancelText}
        onConfirm={() => {
          if (dialog.onConfirm) dialog.onConfirm();
          setDialog((d) => ({ ...d, open: false, onConfirm: null }));
        }}
        onCancel={() =>
          setDialog((d) => ({ ...d, open: false, onConfirm: null }))
        }
      />
    </div>
  );
}
