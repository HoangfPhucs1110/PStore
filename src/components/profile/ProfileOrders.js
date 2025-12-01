import { useState } from "react";
import { getImageUrl } from "../../utils/constants";
import { orderService } from "../../services/orderService";
import ConfirmDialog from "../common/ConfirmDialog";

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

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;
  if (orders.length === 0) return <div className="text-center py-5 text-muted">Bạn chưa có đơn hàng nào.</div>;

  return (
    <>
      <h5 className="fw-bold border-bottom pb-3 mb-4">Lịch sử đơn hàng</h5>
      
      <div className="vstack gap-4">
        {orders.map((order) => {
          const statusInfo = STATUS_MAP[order.status] || { label: order.status, color: "bg-secondary" };
          
          return (
            <div key={order._id} className="card border shadow-sm">
              <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
                <div>
                  <span className="fw-bold text-primary me-2">#{order.code || order._id.slice(-6).toUpperCase()}</span>
                  <span className="small text-muted border-start ps-2">
                    Ngày đặt: {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <span className={`badge rounded-pill ${statusInfo.color} px-3 py-2`}>{statusInfo.label}</span>
              </div>

              <div className="card-body p-0">
                {order.items.map((item, idx) => (
                  <div key={idx} className="d-flex gap-3 p-3 border-bottom">
                    <div className="flex-shrink-0 border rounded p-1" style={{width: 70, height: 70}}>
                        <img src={getImageUrl(item.imageSnapshot)} alt="" className="w-100 h-100 object-fit-contain"/>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-1 text-truncate-2 small fw-bold">{item.nameSnapshot}</h6>
                      <div className="text-muted small">x{item.qty}</div>
                    </div>
                    <div className="text-end">
                        <div className="text-danger fw-semibold">{formatMoney(item.priceSnapshot)}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="card-footer bg-light p-3">
                <div className="row">
                    <div className="col-md-6 mb-3 mb-md-0">
                        <div className="small text-muted mb-1">Địa chỉ nhận hàng:</div>
                        <div className="small fw-medium">{order.shippingInfo?.address}</div>
                        <div className="small text-muted mt-2">Thanh toán:</div>
                        <div className="small fw-medium text-uppercase">{order.paymentMethod}</div>
                    </div>
                    <div className="col-md-6 text-md-end">
                        <div className="d-flex justify-content-between justify-content-md-end gap-3 small mb-1">
                            <span className="text-muted">Tiền hàng:</span><span>{formatMoney(order.itemsPrice)}</span>
                        </div>
                        <div className="d-flex justify-content-between justify-content-md-end gap-3 small mb-2">
                            <span className="text-muted">Phí vận chuyển:</span><span>{formatMoney(order.shippingPrice)}</span>
                        </div>
                        <div className="d-flex justify-content-between justify-content-md-end gap-3 align-items-center pt-2 border-top border-secondary-subtle">
                            <span className="fw-bold">Thành tiền:</span><span className="fs-5 fw-bold text-danger">{formatMoney(order.total)}</span>
                        </div>
                        {order.status === 'pending' && (
                            <div className="mt-3">
                                <button className="btn btn-sm btn-outline-danger px-4" onClick={() => handleCancelRequest(order._id)}>Hủy đơn hàng</button>
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
        title="Hủy đơn hàng"
        message="Bạn có chắc chắn muốn hủy đơn hàng này không?"
        confirmText="Xác nhận hủy"
        onCancel={() => setShowConfirm(false)}
        onConfirm={confirmCancel}
      />
    </>
  );
}