import { useState } from "react";
import { getImageUrl } from "../../utils/constants";
import { orderService } from "../../services/orderService";
import ConfirmDialog from "../common/ConfirmDialog";
import { FiBox, FiClock, FiMapPin, FiCreditCard, FiTrash2 } from "react-icons/fi";

const formatMoney = (n) => `${Number(n || 0).toLocaleString("vi-VN")}đ`;

const STATUS_MAP = {
  pending: { label: "Chờ xác nhận", color: "bg-warning text-dark" },
  shipping: { label: "Đang vận chuyển", color: "bg-info text-white" },
  completed: { label: "Giao thành công", color: "bg-success text-white" },
  canceled: { label: "Đã hủy", color: "bg-secondary text-white" },
};

export default function ProfileOrders({ orders, loading, onReload }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [cancelId, setCancelId] = useState(null);

  const handleCancelRequest = (id) => {
    setCancelId(id);
    setShowConfirm(true);
  };

  const confirmCancel = async () => {
    if (!cancelId) return;
    try {
      await orderService.updateStatus(cancelId, "canceled");
      setShowConfirm(false);
      setCancelId(null);
      if (onReload) onReload();
    } catch (error) {
      alert("Không thể hủy đơn hàng này.");
    }
  };

  if (loading) return (
    <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-muted">Đang tải đơn hàng...</p>
    </div>
  );

  if (orders.length === 0) return (
    <div className="text-center py-5 bg-white rounded-3 shadow-sm border border-dashed">
        <div className="text-muted mb-3 opacity-50"><FiBox size={60}/></div>
        <h5 className="fw-bold text-dark">Chưa có đơn hàng nào</h5>
        <p className="text-muted">Hãy mua sắm để lấp đầy danh sách này nhé!</p>
    </div>
  );

  return (
    <>
      <div className="d-flex align-items-center gap-2 mb-4 pb-2 border-bottom">
        <FiBox className="text-primary" size={24} />
        <h5 className="fw-bold m-0">Lịch sử đơn hàng ({orders.length})</h5>
      </div>
      
      <div className="vstack gap-4">
        {orders.map((order) => {
          const statusInfo = STATUS_MAP[order.status] || { label: order.status, color: "bg-secondary" };
          
          return (
            <div key={order._id} className="card border-0 shadow-sm rounded-4 overflow-hidden transition-hover">
              {/* HEADER */}
              <div className="card-header bg-white border-bottom p-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
                <div>
                  <span className="text-muted small text-uppercase fw-bold ls-1">Mã đơn:</span>
                  <span className="fw-bold text-primary ms-2 fs-5">#{order.code || order._id.slice(-6).toUpperCase()}</span>
                  <span className="text-muted small ms-3 border-start ps-3">
                    <FiClock className="me-1 mb-1"/> 
                    {new Date(order.createdAt).toLocaleDateString("vi-VN", { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className={`badge rounded-pill px-3 py-2 ${statusInfo.color}`}>
                    {statusInfo.label}
                </div>
              </div>

              {/* BODY */}
              <div className="card-body p-0">
                {order.items.map((item, idx) => (
                  <div key={idx} className="d-flex gap-3 p-3 border-bottom hover-bg-light">
                    <div className="position-relative" style={{width: 80, height: 80}}>
                        <img 
                            src={getImageUrl(item.imageSnapshot)} 
                            alt={item.nameSnapshot}
                            className="w-100 h-100 object-fit-contain rounded border bg-white p-1"
                        />
                        <span className="position-absolute top-0 end-0 translate-middle badge rounded-pill bg-secondary" style={{fontSize: 10}}>x{item.qty}</span>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-1 fw-bold text-dark text-truncate-2">{item.nameSnapshot}</h6>
                      <div className="text-danger fw-bold">{formatMoney(item.priceSnapshot)}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* FOOTER - ĐÃ CHỈNH SỬA LAYOUT */}
              <div className="card-footer bg-light p-3">
                <div className="row g-3 align-items-center">
                    {/* Cột Trái: Thông tin */}
                    <div className="col-md-7">
                        <div className="d-flex flex-column gap-2 text-secondary small">
                            <div className="d-flex gap-2">
                                <FiMapPin className="mt-1 flex-shrink-0"/> 
                                <span>
                                    <strong>Giao tới:</strong> {order.shippingInfo?.fullName} - {order.shippingInfo?.phone}
                                    <br/>
                                    {order.shippingInfo?.address}
                                </span>
                            </div>
                            <div className="d-flex gap-2 align-items-center">
                                <FiCreditCard className="flex-shrink-0"/>
                                <span>
                                    <strong>Thanh toán:</strong> {order.paymentMethod === 'PAYOS' ? 'Online (PayOS)' : 'COD'} 
                                    <span className={`ms-2 badge ${order.paymentStatus === 'paid' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'} border`}>
                                        {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Cột Phải: Tiền & Nút (Căn giữa nội dung) */}
                    <div className="col-md-5 border-start-md ps-md-4">
                        <div className="d-flex justify-content-between w-100 mb-1">
                            <span className="text-muted">Tiền hàng:</span>
                            <span>{formatMoney(order.itemsPrice)}</span>
                        </div>
                        <div className="d-flex justify-content-between w-100 mb-2 border-bottom pb-2">
                            <span className="text-muted">Phí ship:</span>
                            <span>{formatMoney(order.shippingPrice)}</span>
                        </div>
                        <div className="d-flex justify-content-between w-100 align-items-center mb-3">
                            <span className="fw-bold text-dark">Tổng cộng:</span>
                            <span className="fs-4 fw-bold text-danger">{formatMoney(order.total)}</span>
                        </div>

                        {/* NÚT HỦY ĐƠN - CĂN GIỮA */}
                        {order.status === 'pending' && (
                            <div className="d-flex justify-content-center">
                                <button 
                                    className="btn btn-outline-danger btn-sm px-4 d-flex align-items-center gap-2 hover-bg-danger" 
                                    onClick={() => handleCancelRequest(order._id)}
                                >
                                    <FiTrash2 /> Hủy đơn hàng
                                </button>
                            </div>
                        )}
                    </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmDialog 
        show={showConfirm}
        title="Xác nhận hủy đơn"
        message="Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không thể hoàn tác."
        confirmText="Hủy đơn hàng"
        cancelText="Giữ lại"
        onCancel={() => setShowConfirm(false)}
        onConfirm={confirmCancel}
      />

      <style>{`
        .ls-1 { letter-spacing: 1px; }
        .text-truncate-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .hover-bg-light:hover { background-color: #f8f9fa; }
        .transition-hover { transition: transform 0.2s, box-shadow 0.2s; }
        .transition-hover:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important; }
        .border-start-md { border-left: 1px solid #dee2e6; }
        @media (max-width: 768px) { .border-start-md { border-left: none; border-top: 1px solid #dee2e6; padding-top: 1rem; } }
      `}</style>
    </>
  );
}