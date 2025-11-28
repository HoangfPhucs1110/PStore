import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

export default function Header() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [openUser, setOpenUser] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const cartCount = cart.reduce((s, x) => s + x.qty, 0);

  const handleLogout = () => {
    logout();
    setShowLogout(false);
    setOpenUser(false);
  };

  return (
    <>
      <header className="shadow-sm bg-white mb-2">
        <div className="container py-2 d-flex align-items-center justify-content-between">
          <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
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
            <span className="fw-bold text-primary fs-5">PStore</span>
          </Link>

          <nav className="d-none d-md-flex gap-3">
            <NavLink to="/" className="nav-link">
              Trang chủ
            </NavLink>
            <NavLink to="/products" className="nav-link">
              Sản phẩm
            </NavLink>
            <NavLink to="/cart" className="nav-link">
              Giỏ hàng
            </NavLink>
            {user?.role === "admin" && (
              <NavLink to="/admin" className="nav-link">
                Admin
              </NavLink>
            )}
          </nav>

          <div className="d-flex align-items-center gap-3">
            <Link
              to="/cart"
              className="btn btn-outline-primary btn-sm position-relative"
            >
              <i className="bi bi-cart3 me-1" />
              Giỏ hàng
              {cartCount > 0 && (
                <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                  {cartCount}
                </span>
              )}
            </Link>

            {!user && (
              <Link to="/login" className="btn btn-primary btn-sm">
                Đăng nhập
              </Link>
            )}

            {user && (
              <div className="position-relative">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                  onClick={() => setOpenUser((v) => !v)}
                >
                  {user.name}
                  <span style={{ fontSize: 12 }}>▾</span>
                </button>

                {openUser && (
                  <div
                    className="position-absolute end-0 mt-1 bg-white border rounded shadow-sm small"
                    style={{ minWidth: 170, zIndex: 1000 }}
                  >
                    <Link
                      to="/profile"
                      className="d-block px-3 py-2 text-decoration-none text-dark hover-bg"
                      onClick={() => setOpenUser(false)}
                    >
                      Tài khoản của tôi
                    </Link>
                    <button
                      className="d-block w-100 text-start px-3 py-2 border-0 bg-white hover-bg"
                      onClick={() => setShowLogout(true)}
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
