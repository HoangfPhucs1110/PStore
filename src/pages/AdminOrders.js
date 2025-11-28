import { useEffect, useState } from "react";
import api from "../api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const load = () =>
    api.get("/orders").then((res) => {
      setOrders(res.data);
    });

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    load();
  };

  return (
    <div className="container mt-3">
      <h3 className="mb-3">Quản lý đơn hàng</h3>
      <div className="bg-white rounded-3 shadow-sm p-3">
        <table className="table table-sm align-middle mb-0">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Khách hàng</th>
              <th>Ngày</th>
              <th>Tổng</th>
              <th>Trạng thái</th>
              <th>Thanh toán</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td>#{o._id.slice(-6)}</td>
                <td>{o.userId?.name || "Guest"}</td>
                <td>{new Date(o.createdAt).toLocaleString()}</td>
                <td>{o.total.toLocaleString()} đ</td>
                <td>{o.status}</td>
                <td>{o.paymentStatus}</td>
<td className="text-end">
  <select
    className="form-select form-select-sm d-inline-block w-auto me-2"
    value={o.status}
    onChange={(e) => updateStatus(o._id, e.target.value)}
  >
    <option value="pending">Đang chờ</option>
    <option value="shipping">Đã gửi vận chuyển</option>
    <option value="completed">Đã hoàn thành</option>
    <option value="canceled">Đã hủy</option>
  </select>
</td>

              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center small text-muted">
                  Chưa có đơn hàng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
