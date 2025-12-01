import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { FiShoppingCart, FiSearch, FiHeart, FiX, FiTruck } from "react-icons/fi";
import { productService } from "../../services/productService";
import { getImageUrl } from "../../utils/constants";
import ConfirmDialog from "./ConfirmDialog";

export default function Header() {
  const { user, logout } = useAuth();
  // --- SỬA TẠI ĐÂY: Thêm totalPrice vào destructuring ---
  const { cart, totalItem, totalPrice, removeFromCart } = useCart(); 
  
  const [keyword, setKeyword] = useState("");
  const [suggests, setSuggests] = useState([]);
  const [showSuggest, setShowSuggest] = useState(false);
  const [showMiniCart, setShowMiniCart] = useState(false); 
  const [openUser, setOpenUser] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const userRef = useRef(null);
  const cartRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSuggest(false);
      if (userRef.current && !userRef.current.contains(e.target)) setOpenUser(false);
      if (cartRef.current && !cartRef.current.contains(e.target)) setShowMiniCart(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = async (e) => {
    const val = e.target.value;
    setKeyword(val);
    if (val.trim().length > 1) {
      try {
        const res = await productService.getAll({ keyword: val, limit: 5 });
        setSuggests(res.products);
        setShowSuggest(true);
      } catch { setSuggests([]); }
    } else {
      setShowSuggest(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      setShowSuggest(false);
      navigate(`/products?keyword=${keyword}`);
    }
  };

  const toggleCart = (e) => {
    e.preventDefault(); 
    setShowMiniCart((prev) => !prev);
  };

  const confirmDelete = () => {
    if (deleteId) {
        removeFromCart(deleteId);
        setDeleteId(null);
    }
  };

  return (
    <>
    <header className="bg-white border-bottom sticky-top shadow-sm" style={{ zIndex: 2000 }}>
      <div className="container py-3 d-flex align-items-center justify-content-between gap-4">
        <Link to="/" className="text-decoration-none d-flex align-items-center gap-2">
          <div className="bg-primary text-white rounded p-1 fw-bold d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, fontSize: 20 }}>P</div>
          <span className="fw-bold fs-4 text-dark">PStore</span>
        </Link>

        {/* SEARCH BAR */}
        <div className="flex-grow-1 position-relative mx-lg-5" ref={searchRef}>
          <form onSubmit={handleSearchSubmit} className="input-group">
            <input 
              className="form-control border-end-0 rounded-start-pill ps-3 bg-light border-0"
              style={{height: 45}}
              placeholder="Tìm kiếm sản phẩm..."
              value={keyword}
              onChange={handleSearchChange}
              onFocus={() => keyword.length > 1 && setShowSuggest(true)}
            />
            <button className="btn btn-light border-start-0 rounded-end-pill pe-3 border-0">
              <FiSearch size={20} className="text-muted" />
            </button>
          </form>
          
          {/* SEARCH SUGGESTIONS */}
          {showSuggest && suggests.length > 0 && (
            <div className="position-absolute w-100 bg-white shadow-lg rounded-3 mt-2 overflow-hidden border" style={{top: "100%", zIndex: 2050}}>
              {suggests.map(p => (
                <Link 
                    key={p._id} 
                    to={`/products/${p.slug}`} 
                    onClick={()=>setShowSuggest(false)} 
                    className="d-flex gap-3 p-2 hover-bg-light border-bottom text-decoration-none align-items-center"
                >
                  <img 
                    src={getImageUrl(p.thumbnail || p.images?.[0])} 
                    width="50" height="50" 
                    className="object-fit-contain rounded border bg-white flex-shrink-0" 
                    alt={p.name}
                    onError={(e) => e.target.src = "https://placehold.co/50?text=IMG"}
                  />
                  <div>
                    <div className="text-dark small fw-medium text-truncate-2">{p.name}</div>
                    <div className="text-danger small fw-bold">{p.price.toLocaleString()}đ</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="d-flex align-items-center gap-3">
          
          <Link 
            to="/order-lookup" 
            className="btn btn-light rounded-circle p-2 text-secondary position-relative hover-icon" 
            title="Tra cứu đơn hàng"
          >
            <FiTruck size={22} />
          </Link>

          <Link to="/wishlist" className="btn btn-light rounded-circle p-2 text-danger position-relative hover-icon">
            <FiHeart size={22} />
          </Link>

          {/* MINI CART */}
          <div className="position-relative" ref={cartRef}>
            <button 
                className="btn btn-light rounded-circle position-relative p-2 border-0 hover-icon" 
                id="cart-icon-target"
                onClick={toggleCart} 
            >
                <FiShoppingCart size={22} />
                {totalItem > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white" style={{fontSize: 10}}>
                        {totalItem}
                    </span>
                )}
            </button>

            {showMiniCart && (
                <div className="position-absolute top-100 end-0 mt-3 bg-white shadow-lg rounded-3 border overflow-hidden animate-fade-in" style={{width: 340, zIndex: 2050}}>
                    <div className="position-absolute top-0 end-0 me-3 mt-n2 bg-white border-top border-start" style={{width: 12, height: 12, transform: "rotate(45deg) translateY(-50%)"}}></div>

                    <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
                        <h6 className="m-0 fw-bold text-dark">Giỏ hàng ({totalItem})</h6>
                        <button onClick={() => setShowMiniCart(false)} className="btn btn-sm btn-link text-muted p-0"><FiX size={18}/></button>
                    </div>
                    
                    <div className="overflow-auto custom-scrollbar" style={{maxHeight: 320}}>
                        {cart.length === 0 ? (
                            <div className="text-center py-5">
                                <FiShoppingCart size={40} className="text-muted opacity-25 mb-2"/>
                                <p className="text-muted small m-0">Giỏ hàng trống</p>
                            </div>
                        ) : (
                            cart.map(item => (
                                <div key={item.productId} className="d-flex gap-3 p-3 border-bottom hover-bg-light position-relative">
                                    <img 
                                        src={getImageUrl(item.image)} 
                                        width="60" height="60" 
                                        className="rounded border object-fit-contain bg-white" 
                                        alt=""
                                        onError={(e) => e.target.src = "https://placehold.co/60?text=IMG"}
                                    />
                                    <div className="flex-grow-1 pe-4">
                                        <div className="text-truncate-2 small fw-medium text-dark mb-1" style={{lineHeight: '1.4'}}>{item.name}</div>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="text-muted small">x{item.qty}</span>
                                            <span className="text-primary fw-bold small">{item.price.toLocaleString()}đ</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={(e) => { 
                                            e.stopPropagation();
                                            setDeleteId(item.productId);
                                            setShowMiniCart(false);
                                        }} 
                                        className="btn btn-sm text-danger position-absolute top-0 end-0 mt-2 me-2 p-1"
                                    >
                                        <FiX size={16}/>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {cart.length > 0 && (
                        <div className="p-3 bg-light border-top">
                            <div className="d-flex justify-content-between mb-3 small fw-bold">
                                <span>Tổng cộng:</span>
                                <span className="text-danger fs-6">{totalPrice.toLocaleString()}đ</span>
                            </div>
                            <div className="d-flex gap-2">
                                <Link to="/cart" onClick={() => setShowMiniCart(false)} className="btn btn-outline-primary btn-sm flex-grow-1 fw-bold">Xem giỏ hàng</Link>
                                <button onClick={() => { setShowMiniCart(false); navigate("/checkout"); }} className="btn btn-primary btn-sm flex-grow-1 fw-bold">Thanh toán</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
          </div>

          {/* USER MENU */}
          {user ? (
            <div className="dropdown" ref={userRef}>
              <button className="btn p-0 border-0 d-flex align-items-center gap-2" onClick={() => setOpenUser(!openUser)}>
                <img 
                    src={getImageUrl(user.avatarUrl)} 
                    className="rounded-circle border" 
                    width="40" height="40" 
                    style={{objectFit: "cover"}} 
                    alt="" 
                    onError={(e) => e.target.src = "https://placehold.co/40?text=U"}
                />
              </button>
              {openUser && (
                <div className="dropdown-menu dropdown-menu-end show shadow-lg border-0 rounded-3 mt-2 p-2" style={{minWidth: 200, zIndex: 2050, position: 'absolute', right: 0, top: '100%'}}>
                    <li className="px-3 py-2 border-bottom mb-2">
                        <div className="fw-bold text-dark">{user.name}</div>
                        <div className="small text-muted">{user.email}</div>
                    </li>
                    {(user.role === 'admin' || user.role === 'staff') && <li><Link className="dropdown-item rounded mb-1 text-primary fw-bold" to="/admin" onClick={()=>setOpenUser(false)}>Quản trị hệ thống</Link></li>}
                    <li><Link className="dropdown-item rounded mb-1" to="/profile" onClick={()=>setOpenUser(false)}>Tài khoản của tôi</Link></li>
                    <li><Link className="dropdown-item rounded mb-1" to="/profile?tab=orders" onClick={()=>setOpenUser(false)}>Đơn mua</Link></li>
                    <li><hr className="dropdown-divider"/></li>
                    <li><button className="dropdown-item rounded text-danger" onClick={logout}>Đăng xuất</button></li>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary rounded-pill px-4 fw-bold">Đăng nhập</Link>
          )}
        </div>
      </div>
    </header>

    <ConfirmDialog 
        show={!!deleteId}
        title="Xóa khỏi giỏ hàng?"
        message="Bạn có chắc chắn muốn xóa sản phẩm này?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        confirmText="Xóa"
    />
    
    <style>{`
        .text-truncate-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .hover-bg-light:hover { background-color: #f8f9fa; }
        .hover-icon:hover { background-color: #f1f5f9; color: var(--primary) !important; }
    `}</style>
    </>
  );
}