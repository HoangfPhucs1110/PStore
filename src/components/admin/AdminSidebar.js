import { Link, useLocation } from "react-router-dom";
import { FiHome, FiPackage, FiShoppingBag, FiUsers, FiStar, FiLogOut, FiMessageSquare, FiArrowLeft, FiMail } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

export default function AdminSidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  // Menu cơ bản
  let menu = [
    { path: "/admin", label: "Dashboard", icon: <FiHome /> },
    { path: "/admin/chat", label: "Hỗ trợ khách hàng", icon: <FiMessageSquare /> }, // Ai cũng thấy
    { path: "/admin/products", label: "Sản phẩm", icon: <FiPackage /> },
    { path: "/admin/orders", label: "Đơn hàng", icon: <FiShoppingBag /> },
    { path: "/admin/reviews", label: "Đánh giá", icon: <FiStar /> },
  ];

  // Chỉ Admin mới thấy quản lý User và Email
  if (user?.role === "admin") {
    menu.push(
        { path: "/admin/users", label: "Người dùng", icon: <FiUsers /> },
        { path: "/admin/subscribers", label: "Email Marketing", icon: <FiMail /> }
    );
  }

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-white border-end h-100 d-flex flex-column sticky-top" style={{ width: 260, height: "calc(100vh - 0px)", zIndex: 100 }}>
      <div className="p-4 border-bottom bg-light">
        <h6 className="fw-bold text-primary m-0 text-uppercase ls-1">
            {user?.role === 'staff' ? 'Staff Portal' : 'Admin Portal'}
        </h6>
      </div>

      <div className="flex-grow-1 py-3 overflow-auto">
        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`d-flex align-items-center gap-3 px-4 py-3 text-decoration-none transition-all border-start border-4 ${
              isActive(item.path) 
                ? "bg-primary-subtle text-primary border-primary fw-bold" 
                : "text-secondary border-transparent hover-bg-light"
            }`}
          >
            <span className="fs-5">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="p-3 border-top bg-light mt-auto">
        <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none text-secondary mb-3 px-3 small">
            <FiArrowLeft /> Về trang chủ
        </Link>
        <button onClick={logout} className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2">
          <FiLogOut /> Đăng xuất
        </button>
      </div>
    </div>
  );
}