import { useEffect, useState } from "react";
import { orderService } from "../../services/orderService";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { getImageUrl } from "../../utils/constants";
import { FiEye, FiTrash2 } from "react-icons/fi";
import { useNotification } from "../../context/NotificationContext";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { notify, confirm } = useNotification();

  const loadOrders = () => {
    orderService.getAll().then(setOrders).catch(console.error);
  };

  useEffect(() => { loadOrders(); }, []);

  const handleStatus = async (id, status) => {
    try {
      await orderService.updateStatus(id, status);
      
      // Cập nhật State cục bộ ngay lập tức để UI phản hồi nhanh
      setOrders(prev => prev.map(o => {
          if (o._id === id) {
              return { 
                  ...o, 
                  status: status,
                  // Nếu chọn hoàn thành -> Tự động đổi trạng thái thanh toán trên giao diện
                  paymentStatus: status === 'completed' ? 'paid' : o.paymentStatus 
              };
          }
          return o;
      }));
      
      notify("Cập nhật trạng thái thành công", "success");
    } catch {
      notify("Lỗi cập nhật", "error");
    }
  };

  const handleDelete = (id) => {
      confirm("Bạn chắc chắn muốn xóa đơn hàng này?", async () => {
          try {
              await orderService.delete(id);
              notify("Đã xóa đơn hàng", "success");
              loadOrders();
          } catch (err) {
              notify("Lỗi khi xóa đơn hàng", "error");
          }
      });
  };

  return (
    <div className="d-flex bg-light min-vh-100">
      <AdminSidebar />
      <div className="flex-grow-1 p-4">
        <h4 className="fw-bold mb-4">Quản lý đơn hàng</h4>
        <div className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Thanh toán</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th className="text-end pe-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o._id}>
                    <td className="ps-4 fw-bold text-primary">#{o.code || o._id.slice(-6).toUpperCase()}</td>
                    <td>
                        <div className="fw-medium">{o.shippingInfo?.fullName}</div>
                        <div className="small text-muted">{o.shippingInfo?.phone}</div>
                    </td>
                    
                    <td>
                        <span className={`badge ${o.paymentMethod === 'PAYOS' ? 'bg-primary' : 'bg-dark'}`}>
                            {o.paymentMethod === 'PAYOS' ? 'ONLINE (PayOS)' : 'COD'}
                        </span>
                        <div className="small mt-1 text-muted">
                            {/* Logic hiển thị trạng thái thanh toán */}
                            {o.paymentStatus === 'paid' ? 
                                <span className="text-success fw-bold">✓ Đã thanh toán</span> : 
                                <span className="text-warning fw-bold">Chưa thanh toán</span>
                            }
                        </div>
                    </td>

                    <td className="fw-bold text-danger">{o.total.toLocaleString()}đ</td>
                    <td>
                      <select 
                        className={`form-select form-select-sm border-0 fw-bold ${
                            o.status === 'completed' ? 'text-success bg-success-subtle' :
                            o.status === 'canceled' ? 'text-secondary bg-secondary-subtle' :
                            o.status === 'shipping' ? 'text-info bg-info-subtle' : 'text-warning bg-warning-subtle'
                        }`}
                        style={{width: 130, cursor: 'pointer'}}
                        value={o.status} 
                        onChange={(e) => handleStatus(o._id, e.target.value)}
                      >
                        <option value="pending">Chờ xử lý</option>
                        <option value="shipping">Đang giao</option>
                        <option value="completed">Hoàn thành</option>
                        <option value="canceled">Đã hủy</option>
                      </select>
                    </td>
                    <td className="text-end pe-4">
                        <button className="btn btn-light btn-sm text-primary me-2" onClick={() => setSelectedOrder(o)} title="Xem chi tiết"><FiEye /></button>
                        <button className="btn btn-light btn-sm text-danger" onClick={() => handleDelete(o._id)} title="Xóa đơn hàng"><FiTrash2 /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedOrder && (
        <div className="modal d-block" style={{backgroundColor: "rgba(0,0,0,0.5)"}}>
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content border-0 shadow">
                    <div className="modal-header">
                        <h5 className="modal-title fw-bold">Chi tiết đơn hàng #{selectedOrder.code}</h5>
                        <button className="btn-close" onClick={() => setSelectedOrder(null)}></button>
                    </div>
                    <div className="modal-body p-4">
                        <div className="row mb-4">
                            <div className="col-md-6 border-end">
                                <h6 className="text-primary fw-bold mb-3 text-uppercase small ls-1">Thông tin nhận hàng</h6>
                                <p className="mb-2"><strong>Người nhận:</strong> {selectedOrder.shippingInfo?.fullName}</p>
                                <p className="mb-2"><strong>SĐT:</strong> {selectedOrder.shippingInfo?.phone}</p>
                                <p className="mb-2"><strong>Địa chỉ:</strong> {selectedOrder.shippingInfo?.address}</p>
                            </div>
                            <div className="col-md-6 ps-md-4">
                                <h6 className="text-primary fw-bold mb-3 text-uppercase small ls-1">Thông tin đơn hàng</h6>
                                <p className="mb-2"><strong>Ngày đặt:</strong> {new Date(selectedOrder.createdAt).toLocaleString("vi-VN")}</p>
                                <p className="mb-2">
                                    <strong>Thanh toán:</strong> <span className="badge bg-primary ms-1">{selectedOrder.paymentMethod}</span>
                                    <span className="ms-2 small fw-bold text-success">
                                        ({selectedOrder.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'})
                                    </span>
                                </p>
                                <div className="p-2 bg-warning-subtle rounded border border-warning-subtle">
                                    <strong>Ghi chú:</strong> <span className="fst-italic">{selectedOrder.note || "Không có ghi chú"}</span>
                                </div>
                            </div>
                        </div>
                        <h6 className="text-primary fw-bold mb-3 text-uppercase small ls-1">Sản phẩm đã đặt</h6>
                        <div className="table-responsive mb-3 border rounded">
                            <table className="table table-borderless align-middle mb-0">
                                <thead className="table-light border-bottom">
                                    <tr><th className="ps-3">Sản phẩm</th><th className="text-center">SL</th><th className="text-end pe-3">Thành tiền</th></tr>
                                </thead>
                                <tbody>
                                    {selectedOrder.items.map((item, idx) => (
                                        <tr key={idx} className="border-bottom">
                                            <td className="ps-3">
                                                <div className="d-flex align-items-center gap-2">
                                                    <img src={getImageUrl(item.imageSnapshot)} width="48" height="48" className="rounded border object-fit-cover" alt=""/>
                                                    <div className="fw-medium small text-dark">{item.nameSnapshot}</div>
                                                </div>
                                            </td>
                                            <td className="text-center">{item.qty}</td>
                                            <td className="text-end pe-3 fw-bold">{(item.priceSnapshot * item.qty).toLocaleString()}đ</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="d-flex justify-content-end">
                            <div className="d-flex justify-content-between w-50">
                                <span className="fw-bold fs-5">Tổng cộng:</span>
                                <span className="fw-bold fs-5 text-danger">{selectedOrder.total?.toLocaleString()}đ</span>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer bg-light"><button className="btn btn-secondary px-4" onClick={() => setSelectedOrder(null)}>Đóng</button></div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}