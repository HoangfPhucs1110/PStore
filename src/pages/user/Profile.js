import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext"; // Sử dụng hệ thống thông báo mới
import { authService } from "../../services/authService";
import { orderService } from "../../services/orderService";

// Import các component con
import ProfileSidebar from "../../components/profile/ProfileSidebar";
import ProfileInfo from "../../components/profile/ProfileInfo";
import ProfileAddresses from "../../components/profile/ProfileAddresses";
import ProfileOrders from "../../components/profile/ProfileOrders";

export default function Profile() {
  const { user, setUser } = useAuth();
  const { notify } = useNotification(); // Hook thông báo toàn cục
  const location = useLocation();
  const fileInputRef = useRef(null);

  const [tab, setTab] = useState("info");
  
  // Dữ liệu
  const [profile, setProfile] = useState({ name: "", phone: "", avatarUrl: "" });
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  
  // Trạng thái UI
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // 1. Đồng bộ Tab từ URL (ví dụ: /profile?tab=orders)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const t = params.get("tab");
    if (t) setTab(t);
  }, [location.search]);

  // 2. Load dữ liệu User ban đầu
  useEffect(() => {
    if (user) {
      setProfile({ 
        name: user.name || "", 
        phone: user.phone || "", 
        avatarUrl: user.avatarUrl || "" 
      });
      setAddresses(user.addresses || []);
    }
  }, [user]);

  // 3. Hàm tải lại đơn hàng (dùng khi tab Orders active hoặc khi vừa hủy đơn)
  const fetchOrders = () => {
    setLoading(true);
    orderService.getMyOrders()
      .then(setOrders)
      .catch((err) => console.error("Load orders error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (tab === "orders") {
      fetchOrders();
    }
  }, [tab]);

  // --- HÀM XỬ LÝ CẬP NHẬT THÔNG TIN ---
  const handleUpdateProfile = async (updates) => {
    setSaving(true);
    try {
      const updatedUser = await authService.updateProfile(updates);
      
      // Cập nhật lại Context và State local
      setUser(updatedUser); 
      setProfile({ 
        name: updatedUser.name, 
        phone: updatedUser.phone, 
        avatarUrl: updatedUser.avatarUrl 
      });
      setAddresses(updatedUser.addresses || []);
      
      // Thông báo thành công (Toast)
      notify("Cập nhật thông tin thành công!", "success");
    } catch (err) {
      // Thông báo lỗi
      notify(err.response?.data?.message || "Cập nhật thất bại", "error");
    } finally {
      setSaving(false);
    }
  };

  // --- HÀM UPLOAD AVATAR ---
  const handleUploadAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate loại file ảnh
    if (!file.type.startsWith("image/")) {
        notify("Vui lòng chọn file ảnh hợp lệ", "warning");
        return;
    }

    try {
        // Tạo FormData gửi lên server
        const fd = new FormData(); 
        fd.append("avatar", file);
        
        // Gọi API
        await authService.uploadAvatar(fd); 
        
        // Refresh lại thông tin user để lấy URL ảnh mới nhất từ DB
        const updated = await authService.getMe();
        setUser(updated);
        setProfile(prev => ({...prev, avatarUrl: updated.avatarUrl}));
        
        notify("Đổi ảnh đại diện thành công!", "success");
    } catch(err) {
        notify("Lỗi upload ảnh", "error");
    } finally {
        // Reset input file để có thể chọn lại cùng 1 ảnh nếu muốn
        if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // --- HÀM XỬ LÝ ĐỊA CHỈ (Gọi lại handleUpdateProfile) ---
  const handleSaveAddresses = (newAddressList) => {
    handleUpdateProfile({ addresses: newAddressList });
  };

  return (
    <div className="bg-light py-4 min-vh-100">
      <div className="container">
        <div className="row g-4">
          {/* CỘT TRÁI: SIDEBAR */}
          <div className="col-lg-3">
            <ProfileSidebar 
              user={user} 
              activeTab={tab} 
              setTab={setTab} 
              onAvatarClick={() => fileInputRef.current.click()}
            />
            {/* Input file ẩn để upload avatar */}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="d-none" 
              onChange={handleUploadAvatar} 
              accept="image/*"
            />
          </div>
          
          {/* CỘT PHẢI: NỘI DUNG CHÍNH */}
          <div className="col-lg-9">
            <div className="bg-white rounded-3 shadow-sm p-4 h-100">
              
              {/* Tab 1: Thông tin cá nhân */}
              {tab === "info" && (
                <ProfileInfo 
                  profile={profile} 
                  user={user} 
                  saving={saving} 
                  onSave={(data) => handleUpdateProfile(data)}
                />
              )}
              
              {/* Tab 2: Sổ địa chỉ */}
              {tab === "addresses" && (
                <ProfileAddresses 
                  addresses={addresses} 
                  onUpdate={handleSaveAddresses}
                  saving={saving}
                />
              )}
              
              {/* Tab 3: Quản lý đơn hàng */}
              {tab === "orders" && (
                <ProfileOrders 
                  orders={orders} 
                  loading={loading} 
                  onReload={fetchOrders} // Truyền hàm reload xuống để gọi khi hủy đơn
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}