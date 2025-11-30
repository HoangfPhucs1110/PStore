import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import ConfirmDialog from "../components/ConfirmDialog";
import { useLocation } from "react-router-dom";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import ProfileInfo from "../components/profile/ProfileInfo";
import ProfileAddresses from "../components/profile/ProfileAddresses";
import ProfileOrders from "../components/profile/ProfileOrders";
import "./Profile.css";

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

  useEffect(() => {
  const params = new URLSearchParams(location.search);
  const t = params.get("tab") || "info";
  setTab(t);
}, [location.search]);

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
        setEditingAddress(
          makeEmptyAddress(d.name || user.name, d.phone || "")
        );
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

  const saveProfileWithAddresses = async (addrList) => {
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
        addresses: addrList
      };
      const res = await api.put("/auth/profile", payload);
      const d = res.data || {};
      setProfile((prev) => ({
        ...prev,
        name: d.name || prev.name,
        phone: d.phone || prev.phone,
        avatarUrl: d.avatarUrl || prev.avatarUrl
      }));
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

  const saveProfile = () => {
    saveProfileWithAddresses(addresses);
  };

  const handleProfileChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
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

  const saveAddress = async () => {
    if (
      !editingAddress.fullName.trim() ||
      !editingAddress.phone.trim() ||
      !editingAddress.address.trim()
    ) {
      showAlert("Vui lòng nhập đầy đủ tên, số điện thoại và địa chỉ.");
      return;
    }

    let newList = [...addresses];

    if (editingAddress.isDefault) {
      newList = newList.map((a) => ({ ...a, isDefault: false }));
    }

    if (editingAddress.index >= 0 && editingAddress.index < newList.length) {
      newList[editingAddress.index] = {
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
      newList = [...newList, newAddr];
    }

    setAddresses(newList);
    setEditingAddress(
      makeEmptyAddress(profile.name || user?.name, profile.phone)
    );
    await saveProfileWithAddresses(newList);
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
    showConfirm("Bạn có chắc muốn xóa địa chỉ này?", async () => {
      const newList = addresses.filter((_, i) => i !== index);
      setAddresses(newList);
      await saveProfileWithAddresses(newList);
    });
  };

  const setDefaultAddress = async (index) => {
    const newList = addresses.map((a, i) => ({
      ...a,
      isDefault: i === index
    }));
    setAddresses(newList);
    await saveProfileWithAddresses(newList);
  };

  if (!user)
    return <div className="container mt-3">Vui lòng đăng nhập.</div>;

  const avatarMainSrc = normalizeAvatar(profile.avatarUrl);
  const avatarSidebarSrc = avatarMainSrc;

  return (
    <div className="bg-light py-4">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-3">
            <ProfileSidebar
              name={profile.name || user.name || "Người dùng"}
              email={user.email}
              avatarUrl={avatarSidebarSrc}
              tab={tab}
              setTab={setTab}
              onAvatarClick={handleAvatarClick}
            />
          </div>
          <div className="col-md-9">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                {tab === "info" && (
                  <ProfileInfo
                    profile={profile}
                    user={user}
                    avatarUrl={avatarMainSrc}
                    saving={saving}
                    avatarUploading={avatarUploading}
                    onChange={handleProfileChange}
                    onSave={saveProfile}
                    onAvatarClick={handleAvatarClick}
                  />
                )}
                {tab === "addresses" && (
                  <ProfileAddresses
                    addresses={addresses}
                    editingAddress={editingAddress}
                    saving={saving}
                    onFieldChange={handleAddressChange}
                    onSave={saveAddress}
                    onEdit={startEditAddress}
                    onDelete={deleteAddress}
                    onSetDefault={setDefaultAddress}
                  />
                )}
                {tab === "orders" && (
                  <ProfileOrders
                    orders={filteredOrders}
                    orderFilter={orderFilter}
                    setOrderFilter={setOrderFilter}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="d-none"
        onChange={handleAvatarChange}
      />

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
