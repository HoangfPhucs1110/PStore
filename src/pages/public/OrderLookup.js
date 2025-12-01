import { useState } from "react";
import { orderService } from "../../services/orderService";
import { getImageUrl } from "../../utils/constants";
import { FiSearch, FiPackage, FiClock, FiTruck, FiCheckCircle, FiXCircle, FiMapPin, FiPhone, FiHash } from "react-icons/fi";

const STATUS_MAP = {
  pending: { label: "Chờ xác nhận", color: "text-warning", icon: <FiClock /> },
  shipping: { label: "Đang vận chuyển", color: "text-info", icon: <FiTruck /> },
  completed: { label: "Giao thành công", color: "text-success", icon: <FiCheckCircle /> },
  canceled: { label: "Đã hủy", color: "text-secondary", icon: <FiXCircle /> },
};

export default function OrderLookup() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [orders, setOrders] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLookup = async (e) => {
    e.preventDefault();
    
    if (!phone.trim() && !code.trim()) {
        return setError("Vui lòng nhập Số điện thoại HOẶC Mã đơn hàng.");
    }
    
    setLoading(true);
    setError("");
    setOrders([]);

    try {
      const res = await orderService.lookup(phone, code);
      // Backend trả về mảng, nên ta gán trực tiếp
      setOrders(res); 
    } catch (err) {
      setOrders([]);
      setError(err.response?.data?.message || "Không tìm thấy đơn hàng nào phù hợp.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-7">
            
            {/* FORM TRA CỨU */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h4 className="fw-bold text-center mb-4 text-primary">Tra cứu đơn hàng</h4>
                <form onSubmit={handleLookup}>
                  <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted">Số điện thoại</label>
                        <div className="input-group">
                            <span className="input-group-text bg-white"><FiPhone/></span>
                            <input 
                                className="form-control" 
                                placeholder="Nhập SĐT đặt hàng..." 
                                value={phone} 
                                onChange={e => setPhone(e.target.value)} 
                            />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted">Mã đơn hàng</label>
                        <div className="input-group">
                            <span className="input-group-text bg-white"><FiHash/></span>
                            <input 
                                className="form-control text-uppercase" 
                                placeholder="Nhập mã đơn..." 
                                value={code} 
                                onChange={e => setCode(e.target.value)} 
                            />
                        </div>
                      </div>
                  </div>
                  <div className="form-text text-center mb-3 mt-2">
                      Chỉ cần nhập 1 trong 2 thông tin để tra cứu.
                  </div>
                  <button className="btn btn-primary w-100 fw-bold py-2 shadow-sm" disabled={loading}>
                    {loading ? "Đang tìm kiếm..." : <><FiSearch className="me-2"/> Tra cứu ngay</>}
                  </button>
                  {error && <div className="alert alert-danger mt-3 small py-2 text-center">{error}</div>}
                </form>
              </div>
            </div>

            {/* KẾT QUẢ TRA CỨU (DANH SÁCH) */}
            <div className="vstack gap-4">
                {orders.length > 0 && (
                    <div className="d-flex align-items-center gap-2 mb-2">
                        <FiPackage className="text-primary"/>
                        <h5 className="fw-bold m-0">Tìm thấy {orders.length} đơn hàng</h5>
                    </div>
                )}

                {orders.map(order => (
                    <div key={order._id} className="card border-0 shadow-sm animate-slide-up overflow-hidden">
                        {/* Header của mỗi đơn */}
                        <div className="card-header bg-white p-3 border-bottom d-flex justify-content-between align-items-center">
                            <div>
                                <span className="text-muted small text-uppercase fw-bold ls-1">Mã đơn:</span>
                                <span className="fw-bold text-primary ms-2">#{order.code || order._id.slice(-6).toUpperCase()}</span>
                                <span className="text-muted small ms-2 border-start ps-2">
                                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                                </span>
                            </div>
                            <div className={`d-flex align-items-center gap-2 fw-bold small ${STATUS_MAP[order.status]?.color}`}>
                                {STATUS_MAP[order.status]?.icon}
                                {STATUS_MAP[order.status]?.label}
                            </div>
                        </div>
                        
                        {/* Danh sách sản phẩm */}
                        <div className="card-body p-0">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="d-flex gap-3 p-3 border-bottom hover-bg-light">
                                    <img 
                                        src={getImageUrl(item.imageSnapshot)} 
                                        width="60" height="60" 
                                        className="rounded border bg-white object-fit-contain" 
                                        alt=""
                                        onError={(e) => e.target.src = "https://placehold.co/60?text=IMG"}
                                    />
                                    <div className="flex-grow-1">
                                        <div className="fw-medium text-dark small text-truncate-2">{item.nameSnapshot}</div>
                                        <div className="text-muted small">x{item.qty}</div>
                                    </div>
                                    <div className="fw-bold small text-end">{(item.priceSnapshot * item.qty).toLocaleString()}đ</div>
                                </div>
                            ))}
                        </div>

                        {/* Footer thông tin */}
                        <div className="card-footer bg-light p-3">
                            <div className="row g-2 small">
                                <div className="col-12 d-flex gap-2 text-secondary">
                                    <FiMapPin className="mt-1 flex-shrink-0"/>
                                    <span>{order.shippingInfo?.address}</span>
                                </div>
                                <div className="col-12 border-top pt-2 mt-2 d-flex justify-content-between align-items-center">
                                    <span className="fw-bold text-dark">Tổng thanh toán:</span>
                                    <span className="fs-5 fw-bold text-danger">{order.total?.toLocaleString()}đ</span>
                                </div>
                                <div className="col-12 text-end">
                                    <span className={`badge ${order.paymentStatus === 'paid' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'} border`}>
                                        {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

          </div>
        </div>
      </div>
      <style>{`
        .animate-slide-up { animation: slideUp 0.5s ease-out; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .text-truncate-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .ls-1 { letter-spacing: 1px; }
      `}</style>
    </div>
  );
}