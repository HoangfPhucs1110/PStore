import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { getImageUrl } from "../../utils/constants";
import { FiTrash2, FiMinus, FiPlus, FiArrowRight, FiShoppingBag } from "react-icons/fi";
import ConfirmDialog from "../../components/common/ConfirmDialog";

export default function Cart() {
  // Lấy shippingPrice từ Context (KHÔNG PHẢI shippingFee)
  const { cart, updateQty, removeFromCart, totalPrice, itemsPrice, shippingPrice } = useCart(); 
  const navigate = useNavigate();

  // State quản lý popup xác nhận xóa
  const [confirmState, setConfirmState] = useState({ show: false, type: "", id: null, msg: "" });

  // Xử lý nút Xóa
  const handleDeleteClick = (id) => {
    setConfirmState({ show: true, type: "delete", id: id, msg: "Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?" });
  };

  // Xử lý giảm số lượng
  const handleDecrease = (item) => {
    if (item.qty > 1) {
      updateQty(item.productId, item.qty - 1);
    } else {
      setConfirmState({ show: true, type: "delete", id: item.productId, msg: "Số lượng về 0 sẽ xóa sản phẩm. Bạn chắc chứ?" });
    }
  };

  // Xác nhận hành động xóa
  const onConfirmAction = () => {
    if (confirmState.type === "delete") {
      removeFromCart(confirmState.id);
    }
    setConfirmState({ show: false, type: "", id: null, msg: "" });
  };

  // --- GIAO DIỆN KHI GIỎ HÀNG TRỐNG ---
  if (cart.length === 0) return (
    <div className="min-vh-100 bg-light d-flex flex-column align-items-center justify-content-center py-5">
        <div className="bg-white p-5 rounded-4 shadow-sm text-center" style={{maxWidth: 400}}>
            <div className="mb-4 text-muted opacity-50">
                <FiShoppingBag size={60} />
            </div>
            <h4 className="fw-bold text-dark mb-2">Giỏ hàng của bạn đang trống</h4>
            <p className="text-muted mb-4 small">Hãy dạo một vòng và chọn những sản phẩm yêu thích nhé!</p>
            <Link to="/products" className="btn btn-primary w-100 py-2 fw-bold rounded-pill">
                Tiếp tục mua sắm
            </Link>
        </div>
    </div>
  );

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
            <FiShoppingBag /> Giỏ hàng <span className="text-muted fs-6 fw-normal">({cart.length} sản phẩm)</span>
        </h4>

        <div className="row g-4">
          {/* --- CỘT TRÁI: DANH SÁCH SẢN PHẨM --- */}
          <div className="col-lg-8">
            <div className="bg-white rounded-4 shadow-sm overflow-hidden">
              {cart.map((item, index) => (
                <div 
                    key={item.productId} 
                    className={`p-3 p-md-4 d-flex gap-3 align-items-center ${index !== cart.length - 1 ? "border-bottom" : ""}`}
                >
                  {/* Ảnh sản phẩm */}
                  <Link to={`/products/${item.slug}`} className="flex-shrink-0">
                    <img 
                        src={getImageUrl(item.image)} 
                        alt={item.name}
                        className="rounded-3 border bg-white object-fit-contain" 
                        style={{width: 80, height: 80}} 
                    />
                  </Link>

                  {/* Thông tin */}
                  <div className="flex-grow-1">
                    <Link to={`/products/${item.slug}`} className="text-decoration-none text-dark fw-bold text-truncate-2 mb-1">
                        {item.name}
                    </Link>
                    <div className="text-primary fw-bold">{item.price?.toLocaleString()}đ</div>
                  </div>

                  {/* Bộ điều khiển số lượng & Xóa */}
                  <div className="d-flex flex-column flex-md-row align-items-end align-items-md-center gap-3">
                    <div className="d-flex align-items-center border rounded-pill px-2 py-1 bg-light">
                        <button className="btn btn-sm btn-link text-dark p-0" onClick={() => handleDecrease(item)}>
                            <FiMinus size={14}/>
                        </button>
                        <span className="fw-bold mx-3 user-select-none" style={{minWidth: 20, textAlign: "center"}}>{item.qty}</span>
                        <button className="btn btn-sm btn-link text-dark p-0" onClick={() => updateQty(item.productId, item.qty + 1)}>
                            <FiPlus size={14}/>
                        </button>
                    </div>
                    
                    <button 
                        className="btn btn-light text-danger btn-sm rounded-circle p-2 hover-bg-danger" 
                        onClick={() => handleDeleteClick(item.productId)}
                        title="Xóa sản phẩm"
                    >
                        <FiTrash2 size={18}/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-3">
                <Link to="/products" className="text-decoration-none text-muted d-inline-flex align-items-center gap-2 hover-text-primary">
                    <FiArrowRight className="rotate-180" /> Tiếp tục mua sắm
                </Link>
            </div>
          </div>

          {/* --- CỘT PHẢI: TỔNG KẾT --- */}
          <div className="col-lg-4">
            <div className="bg-white rounded-4 shadow-sm p-4 sticky-top" style={{top: 90}}>
              <h5 className="fw-bold mb-4">Tóm tắt đơn hàng</h5>
              
              <div className="d-flex justify-content-between mb-3 text-secondary">
                <span>Tạm tính</span>
                <span className="fw-medium">{itemsPrice.toLocaleString()}đ</span>
              </div>
              
              {/* SỬA TẠI ĐÂY: Dùng shippingPrice */}
              <div className="d-flex justify-content-between mb-4 text-secondary">
                <span>Phí vận chuyển</span>
                <span className="fw-medium">{shippingPrice === 0 ? "Miễn phí" : `${shippingPrice.toLocaleString()}đ`}</span>
              </div>

              <div className="border-top pt-3 mb-4">
                <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-dark">Tổng cộng</span>
                    <span className="fs-4 fw-bold text-primary">{totalPrice.toLocaleString()}đ</span>
                </div>
                <div className="text-end text-muted small fst-italic mt-1">
                    (Đã bao gồm VAT nếu có)
                </div>
              </div>

              <button 
                className="btn btn-primary w-100 py-3 fw-bold rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2" 
                onClick={() => navigate("/checkout")}
              >
                TIẾN HÀNH THANH TOÁN <FiArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Popup xác nhận xóa */}
      <ConfirmDialog 
        show={confirmState.show} 
        title="Xác nhận" 
        message={confirmState.msg} 
        confirmText="Xóa bỏ" 
        cancelText="Giữ lại" 
        onConfirm={onConfirmAction} 
        onCancel={() => setConfirmState({ ...confirmState, show: false })} 
      />

      <style>{`
        .hover-bg-danger:hover { background-color: #fee2e2 !important; color: #dc2626 !important; }
        .text-truncate-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .rotate-180 { transform: rotate(180deg); }
      `}</style>
    </div>
  );
}