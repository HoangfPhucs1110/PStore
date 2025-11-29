import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useEffect, useRef, useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

export default function Header() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [openUser, setOpenUser] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const dropdownRef = useRef(null);

  const cartCount = cart.reduce((s, x) => s + x.qty, 0);

  const handleLogout = () => {
    logout();
    setShowLogout(false);
  };

  useEffect(() => {
    const handler = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpenUser(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <>
      <header className="shadow-sm bg-white mb-2">
        <div className="container py-2 d-flex align-items-center justify-content-between">
          {/* Logo */}
          <Link
            to="/"
            className="navbar-brand d-flex align-items-center gap-2 text-decoration-none"
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background:
                  "linear-gradient(135deg,#0d6efd 0%,#1b8ffb 50%,#66ccff 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 700
              }}
            >
              P
            </div>
            <div>
              <div className="fw-bold text-primary mb-0">PStore</div>
              <div
                className="small text-muted"
                style={{ fontSize: 11, lineHeight: 1.1 }}
              >
                Laptop • PC • Gaming gear
              </div>
            </div>
          </Link>

          {/* Khu vực tài khoản */}
          <div className="d-flex align-items-center gap-3">
            {!user && (
              <div className="d-flex gap-2">
                <Link
                  to="/signin"
                  className="btn btn-outline-primary btn-sm"
                >
                  Đăng nhập
                </Link>
                <Link to="/signup" className="btn btn-primary btn-sm">
                  Đăng ký
                </Link>
              </div>
            )}

            {user && (
              <div className="position-relative" ref={dropdownRef}>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm dropdown-toggle d-flex align-items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenUser((v) => !v);
                  }}
                >
                  <span className="me-1">
                    {user.name || user.email}
                  </span>
                </button>

                {openUser && (
                  <div
                    className="dropdown-menu dropdown-menu-end show shadow-sm"
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "100%",
                      marginTop: 4,
                      minWidth: 190,
                      zIndex: 1050
                    }}
                    onClick={() => setOpenUser(false)}
                  >
                    <Link to="/profile" className="dropdown-item">
                      Tài khoản của tôi
                    </Link>
                    <Link
                      to="/profile?tab=orders"
                      className="dropdown-item"
                    >
                      Đơn hàng của tôi
                    </Link>
                    <Link to="/cart" className="dropdown-item">
                      Giỏ hàng{" "}
                      {cartCount > 0 && (
                        <span className="badge bg-primary ms-1">
                          {cartCount}
                        </span>
                      )}
                    </Link>

                    {user.role === "admin" && (
                      <>
                        <div className="dropdown-divider" />
                        <Link to="/admin" className="dropdown-item">
                          Trang quản trị
                        </Link>
                      </>
                    )}

                    <div className="dropdown-divider" />
                    <button
                      type="button"
                      className="dropdown-item text-danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowLogout(true);
                      }}
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <ConfirmDialog
        show={showLogout}
        title="Đăng xuất"
        message="Bạn muốn thoát tài khoản?"
        onCancel={() => setShowLogout(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
