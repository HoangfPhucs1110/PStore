import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { getImageUrl } from "../../utils/constants";
import { FiTrash2, FiMinus, FiPlus } from "react-icons/fi";
import ConfirmDialog from "../../components/common/ConfirmDialog";

export default function Cart() {
  const { cart, updateQty, removeFromCart, totalPrice, itemsPrice, shippingPrice } = useCart();
  const navigate = useNavigate();

  // State quản lý popup xác nhận
  const [confirmState, setConfirmState] = useState({
    show: false,
    type: "", // 'delete' hoặc 'decrease'
    id: null,
    msg: ""
  });

  // Xử lý nút Xóa
  const handleDeleteClick = (id) => {
    setConfirmState({
        show: true,
        type: "delete",
        id: id,
        msg: "Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?"
    });
  };

  // Xử lý nút Giảm số lượng
  const handleDecrease = (item) => {
    if (item.qty > 1) {
        updateQty(item.productId, item.qty - 1);
    } else {
        // Nếu giảm từ 1 xuống 0 -> Hỏi xóa
        setConfirmState({
            show: true,
            type: "delete", // Coi như hành động xóa
            id: item.productId,
            msg: "Số lượng về 0 sẽ xóa sản phẩm khỏi giỏ hàng. Bạn có chắc không?"
        });
    }
  };

  // Xác nhận hành động trong Dialog
  const onConfirmAction = () => {
    if (confirmState.type === "delete") {
        removeFromCart(confirmState.id);
    }
    setConfirmState({ show: false, type: "", id: null, msg: "" });
  };

  if (cart.length === 0) return (
    <div className="container py-5 text-center bg-light rounded my-5">
        <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-2130356-1800917.png" alt="Empty" width="150" />
        <h4 className="mt-3">Giỏ hàng trống</h4>
        <p className="text-muted">Không có sản phẩm nào trong giỏ hàng của bạn.</p>
        <Link to="/products" className="btn btn-primary mt-3 px-4 rounded-pill fw-bold">Mua sắm ngay</Link>
    </div>
  );

  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container">
        <h4 className="fw-bold mb-4">Giỏ hàng ({cart.length} sản phẩm)</h4>
        <div className="row g-4">
          {/* Cột trái: Danh sách sản phẩm */}
          <div className="col-lg-8">
            <div className="bg-white rounded-3 shadow-sm p-3">
              {cart.map(item => (
                <div key={item.productId} className="d-flex gap-3 align-items-center border-bottom py-3 last-no-border">
                  <Link to={`/products/${item.slug}`}>
                    <img 
                        src={getImageUrl(item.image)} 
                        width="80" height="80" 
                        className="object-fit-contain rounded border bg-white" 
                        alt={item.name} 
                    />
                  </Link>
                  
                  <div className="flex-grow-1">
                    <Link to={`/products/${item.slug}`} className="text-decoration-none text-dark fw-medium text-truncate-2 mb-1">
                        {item.name}
                    </Link>
                    <div className="text-primary fw-bold">{item.price.toLocaleString()}đ</div>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    <div className="d-flex align-items-center gap-2 bg-light rounded p-1 border">
                        <button className="btn btn-xs p-1" onClick={() => handleDecrease(item)}><FiMinus size={12}/></button>
                        <span className="fw-bold px-2" style={{minWidth: 20, textAlign: 'center'}}>{item.qty}</span>
                        <button className="btn btn-xs p-1" onClick={() => updateQty(item.productId, item.qty + 1)}><FiPlus size={12}/></button>
                    </div>
                    <button 
                        className="btn btn-light text-danger p-2 rounded-circle hover-bg-danger-subtle" 
                        onClick={() => handleDeleteClick(item.productId)}
                        title="Xóa"
                    >
                        <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cột phải: Tổng tiền */}
          <div className="col-lg-4">
            <div className="bg-white rounded-3 shadow-sm p-4 sticky-top" style={{top: 90}}>
              <h6 className="fw-bold mb-3 border-bottom pb-2">Tóm tắt đơn hàng</h6>
              <div className="d-flex justify-content-between mb-2 text-secondary">
                <span>Tạm tính</span>
                <span>{itemsPrice.toLocaleString()}đ</span>
              </div>
              <div className="d-flex justify-content-between mb-4 text-secondary">
                <span>Phí vận chuyển</span>
                <span>{shippingPrice === 0 ? "Miễn phí" : `${shippingPrice.toLocaleString()}đ`}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-4 pt-2 border-top">
                <span className="fw-bold">Tổng tiền</span>
                <span className="fs-4 fw-bold text-danger">{totalPrice.toLocaleString()}đ</span>
              </div>
              <button className="btn btn-primary w-100 py-3 fw-bold rounded-3 shadow-sm" onClick={() => navigate("/checkout")}>
                TIẾN HÀNH THANH TOÁN
              </button>
              <Link to="/products" className="d-block text-center mt-3 text-decoration-none small text-muted hover-text-primary">
                &larr; Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Popup Xác nhận */}
      <ConfirmDialog 
        show={confirmState.show}
        title="Xác nhận"
        message={confirmState.msg}
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={onConfirmAction}
        onCancel={() => setConfirmState({ ...confirmState, show: false })}
      />
      
      <style>{`
        .last-no-border:last-child { border-bottom: none !important; }
        .hover-bg-danger-subtle:hover { background-color: #fee2e2; color: #dc2626; }
      `}</style>
    </div>
  );
}