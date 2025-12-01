import { FiUser, FiMapPin, FiPackage, FiLogOut } from "react-icons/fi";
import { getImageUrl } from "../../utils/constants";

export default function ProfileSidebar({ user, activeTab, setTab, onAvatarClick }) {
  const menu = [
    { id: "info", label: "Thông tin tài khoản", icon: <FiUser /> },
    { id: "addresses", label: "Sổ địa chỉ", icon: <FiMapPin /> },
    { id: "orders", label: "Quản lý đơn hàng", icon: <FiPackage /> },
  ];

  return (
    <div className="bg-white rounded-3 shadow-sm overflow-hidden">
      <div className="p-4 border-bottom text-center bg-light">
        <div className="position-relative d-inline-block cursor-pointer group" onClick={onAvatarClick}>
          <img 
            src={getImageUrl(user?.avatarUrl)} 
            alt={user?.name}
            className="rounded-circle border border-3 border-white shadow-sm"
            style={{width: 80, height: 80, objectFit: "cover"}}
            onError={(e) => e.target.src = "https://via.placeholder.com/80?text=U"}
          />
          <div className="position-absolute bottom-0 end-0 bg-dark text-white rounded-circle p-1 border border-white" style={{fontSize: 10, width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            ✎
          </div>
        </div>
        <h6 className="mt-2 fw-bold mb-0 text-dark">{user?.name}</h6>
        <small className="text-muted">{user?.email}</small>
      </div>
      <div className="list-group list-group-flush p-2">
        {menu.map(item => (
          <button
            key={item.id}
            className={`list-group-item list-group-item-action border-0 rounded-2 mb-1 d-flex align-items-center gap-3 py-3 px-3 transition-all ${
              activeTab === item.id 
                ? "bg-primary text-white fw-medium shadow-sm" 
                : "text-secondary hover-bg-light"
            }`}
            onClick={() => setTab(item.id)}
          >
            <span className="fs-5">{item.icon}</span> {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}