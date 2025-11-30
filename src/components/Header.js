import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useEffect, useRef, useState } from "react";
import { FiShoppingCart, FiHeart, FiSearch } from "react-icons/fi";
import ConfirmDialog from "./ConfirmDialog";
import api from "../api";

const apiBase =
  api.defaults.baseURL?.replace(/\/api\/?$/, "") || window.location.origin;

const normalizeAvatar = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return apiBase + url;
};

const formatMoney = (n) =>
  `${(Number(n || 0)).toLocaleString("vi-VN")}₫`;

export default function Header() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const nav = useNavigate();

  const [openUser, setOpenUser] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const [keyword, setKeyword] = useState("");
  const [suggests, setSuggests] = useState([]);
  const [showSuggest, setShowSuggest] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const timerRef = useRef(null);

  const cartCount = cart.reduce((s, x) => s + x.qty, 0);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        searchRef.current &&
        !searchRef.current.contains(e.target)
      ) {
        setOpenUser(false);
        setShowSuggest(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const avatarUrl = normalizeAvatar(user?.avatarUrl || "");
  const avatarText = (user?.name || user?.email || "U").charAt(0).toUpperCase();

  const handleChangeSearch = (e) => {
    const value = e.target.value;
    setKeyword(value);

    if (timerRef.current) clearTimeout(timerRef.current);

    if (!value.trim()) {
      setSuggests([]);
      setShowSuggest(false);
      return;
    }

    timerRef.current = setTimeout(async () => {
      const kw = value.trim().toLowerCase();
      try {
        setSearchLoading(true);
        const { data } = await api.get("/products", {
          params: { search: kw, limit: 30 }
        });

        const rawList = Array.isArray(data) ? data : data.items || [];
        const filtered = rawList
          .filter((p) => p?.name?.toLowerCase().includes(kw))
          .slice(0, 8);

        setSuggests(filtered);
        setShowSuggest(true);
      } catch {
        setSuggests([]);
        setShowSuggest(false);
      } finally {
        setSearchLoading(false);
      }
    }, 300);
  };

  const submitSearch = (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    setShowSuggest(false);
    nav(`/products?search=${encodeURIComponent(keyword.trim())}`);
  };

  const clickSuggest = (p) => {
    setShowSuggest(false);
    setKeyword("");
    nav(`/products/${p.slug || p._id}`);
  };

  const handleLogout = () => {
    logout();
    setShowLogout(false);
  };

  return (
    <>
      <header className="border-bottom bg-white">
        <div className="container py-2 d-flex align-items-center justify-content-between gap-3">
          {/* Logo */}
          <Link to="/" className="navbar-brand fw-bold text-primary mb-0">
            PStore
          </Link>

          {/* Ô tìm kiếm */}
          <div
            className="flex-grow-1 d-flex justify-content-center"
            ref={searchRef}
          >
            <div style={{ width: "100%", maxWidth: 550, position: "relative" }}>
              <form
                onSubmit={submitSearch}
                className="d-flex align-items-center bg-light rounded-pill px-3"
              >
                <input
                  type="text"
                  className="form-control border-0 bg-transparent"
                  placeholder="Bạn cần tìm gì?"
                  value={keyword}
                  onChange={handleChangeSearch}
                  onFocus={() => keyword && setShowSuggest(true)}
                />
                <button
                  type="submit"
                  className="btn btn-link p-0 d-flex align-items-center"
                >
                  <FiSearch size={20} />
                </button>
              </form>

              {showSuggest && (
                <div
                  className="bg-white shadow rounded"
                  style={{
                    position: "absolute",
                    zIndex: 1050,
                    width: "calc(100% - 24px)",
                    left: "12px",
                    top: "48px",
                    maxHeight: "360px",
                    overflowY: "auto",
                    borderRadius: "12px",
                    padding: "6px 0"
                  }}
                >
                  {searchLoading && (
                    <div className="px-3 py-2 small text-muted">
                      Đang tìm kiếm...
                    </div>
                  )}

                  {!searchLoading && suggests.length === 0 && (
                    <div className="px-3 py-2 small text-muted">
                      Không tìm thấy sản phẩm phù hợp.
                    </div>
                  )}

                  {!searchLoading &&
                    suggests.map((p) => {
                      const thumb = p.thumbnail
                        ? p.thumbnail.startsWith("http")
                          ? p.thumbnail
                          : apiBase + p.thumbnail
                        : "";

                      return (
                        <button
                          key={p._id}
                          type="button"
                          className="w-100 px-2 py-2 bg-white border-0 d-flex align-items-center gap-2"
                          onClick={() => clickSuggest(p)}
                        >
                          {thumb && (
                            <img
                              src={thumb}
                              alt={p.name}
                              style={{
                                width: 40,
                                height: 40,
                                objectFit: "cover",
                                borderRadius: 8
                              }}
                            />
                          )}
                          <div className="text-start flex-grow-1">
                            <div className="fw-semibold text-truncate">
                              {p.name}
                            </div>
                            <div className="text-danger small">
                              {formatMoney(p.price)}
                              {p.oldPrice > p.price && (
                                <span className="text-muted text-decoration-line-through ms-2">
                                  {formatMoney(p.oldPrice)}
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                </div>
              )}
            </div>
          </div>

          {/* Icon + User */}
          <div className="d-flex align-items-center gap-3">
            <Link
              to="/wishlist"
              className="btn btn-link p-0 border-0 position-relative"
            >
              <FiHeart size={20} />
            </Link>

            <Link
              to="/cart"
              className="btn btn-link p-0 border-0 position-relative"
            >
              <FiShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="position-relative" ref={dropdownRef}>
                <button
                  type="button"
                  className="btn p-0 border-0"
                  onClick={() => setOpenUser((v) => !v)}
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={user.name || user.email}
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        objectFit: "cover"
                      }}
                    />
                  ) : (
                    <div
                      className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
                      style={{ width: 34, height: 34, fontSize: 14 }}
                    >
                      {avatarText}
                    </div>
                  )}
                </button>

                {openUser && (
                  <div
                    className="dropdown-menu dropdown-menu-end show shadow"
                    style={{ position: "absolute", right: 0, top: "120%" }}
                  >
                    <div className="px-3 py-2 small text-muted">
                      <div className="fw-semibold">
                        {user.name || user.email}
                      </div>
                    </div>
                    <div className="dropdown-divider" />
                    <Link to="/profile" className="dropdown-item">
                      Tài khoản của tôi
                    </Link>
                    <Link
                      to="/profile?tab=orders"
                      className="dropdown-item"
                    >
                      Đơn hàng của tôi
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
                      onClick={() => {
                        setOpenUser(false);
                        setShowLogout(true);
                      }}
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-primary btn-sm">
                  Đăng nhập
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Đăng ký
                </Link>
              </>
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
