import { Link, useLocation } from "react-router-dom";
import { FiCheckCircle, FiHome, FiPackage } from "react-icons/fi";

export default function OrderSuccess() {
  const location = useLocation();
  // Lấy thông tin đơn hàng nếu được truyền qua navigate (để hiển thị mã đơn)
  const { order } = location.state || {};

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center p-3">
      <div className="card border-0 shadow-lg rounded-4 overflow-hidden animate-slide-up" style={{ maxWidth: 500, width: "100%" }}>
        
        {/* Phần Header màu xanh */}
        <div className="bg-success text-white text-center py-5 position-relative">
            <div className="position-relative z-1">
                <FiCheckCircle size={80} className="mb-3 animate-bounce" />
                <h2 className="fw-bold mb-0">Đặt hàng thành công!</h2>
                <p className="opacity-75 mb-0">Cảm ơn bạn đã mua sắm tại PStore</p>
            </div>
            
            {/* Họa tiết trang trí (Circles) */}
            <div className="position-absolute top-0 start-0 w-100 h-100 overflow-hidden" style={{opacity: 0.1}}>
                <div className="position-absolute bg-white rounded-circle" style={{width: 100, height: 100, top: -20, left: -20}}></div>
                <div className="position-absolute bg-white rounded-circle" style={{width: 50, height: 50, bottom: 20, right: 10}}></div>
                <div className="position-absolute bg-white rounded-circle" style={{width: 80, height: 80, top: 40, right: -20}}></div>
            </div>
        </div>

        {/* Phần Body thông tin */}
        <div className="card-body p-4 text-center">
            {order && (
                <div className="bg-light rounded p-3 mb-4 border border-dashed">
                    <p className="text-muted small mb-1 text-uppercase ls-1">Mã đơn hàng</p>
                    <h4 className="fw-bold text-primary m-0">#{order.code || order._id?.slice(-6).toUpperCase()}</h4>
                </div>
            )}

            <p className="text-muted mb-4">
                Đơn hàng của bạn đang được hệ thống xử lý. <br/>
                Chúng tôi sẽ thông báo khi đơn hàng được giao đi.
            </p>

            <div className="d-flex flex-column gap-3">
                <Link to="/profile?tab=orders" className="btn btn-primary btn-lg fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2">
                    <FiPackage /> Xem đơn hàng của tôi
                </Link>
                <Link to="/" className="btn btn-outline-secondary btn-lg fw-medium d-flex align-items-center justify-content-center gap-2">
                    <FiHome /> Quay về trang chủ
                </Link>
            </div>
        </div>
        
        <div className="card-footer bg-light p-3 text-center small text-muted">
            Cần hỗ trợ? Liên hệ <strong className="text-dark">1900.5301</strong>
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes bounce { 0%, 20%, 50%, 80%, 100% {transform: translateY(0);} 40% {transform: translateY(-10px);} 60% {transform: translateY(-5px);} }
        .animate-slide-up { animation: slideUp 0.6s ease-out; }
        .animate-bounce { animation: bounce 2s infinite; }
        .ls-1 { letter-spacing: 1px; }
      `}</style>
    </div>
  );
}