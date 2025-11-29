import { useEffect, useState } from "react";
import api from "../api";

const formatMoney = (n) => {
  const num = typeof n === "number" ? n : Number(n || 0);
  return num.toLocaleString();
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const load = () =>
    api.get("/orders").then((res) => {
      setOrders(res.data || []);
    });

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status } : o))
      );
    } catch (e) {
      console.error("updateStatus", e);
      alert(
        e.response?.data?.message || "Cập nhật trạng thái thất bại, thử lại sau."
      );
    }
  };

  return (
    <div className="container my-3">
      <h5 className="mb-3">Quản lý đơn hàng (Admin)</h5>
      <div className="bg-white rounded-3 shadow-sm p-3">
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Thông tin giao hàng</th>
                <th>Sản phẩm</th>
                <th>Tổng tiền</th>
                <th>Thanh toán</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td className="small">#{o._id.slice(-6).toUpperCase()}</td>
                  <td className="small">
                    <div className="fw-semibold">
                      {o.userId?.name || "Khách"}
                    </div>
                    <div className="text-muted">{o.userId?.email}</div>
                  </td>
                  <td className="small">
                    <div>{o.shippingInfo?.fullName}</div>
                    <div>{o.shippingInfo?.phone}</div>
                    <div className="text-muted">{o.shippingInfo?.address}</div>
                    {o.shippingInfo?.note && (
                      <div className="fst-italic">
                        Ghi chú: {o.shippingInfo.note}
                      </div>
                    )}
                  </td>
                  <td className="small">
                    {o.items?.map((it) => (
                      <div key={it.productId || it._id}>
                        {it.nameSnapshot} x {it.qty} (
                        {formatMoney(it.priceSnapshot)}đ)
                      </div>
                    ))}
                  </td>
                  <td className="small fw-semibold">
                    {formatMoney(o.total)} đ
                  </td>
                  <td className="small">
                    <div>{o.paymentMethod || "COD"}</div>
                    <div className="text-muted">
                      {o.paymentStatus === "paid"
                        ? "Đã thanh toán"
                        : o.paymentStatus === "refunded"
                        ? "Đã hoàn tiền"
                        : "Chưa thanh toán"}
                    </div>
                  </td>
                  <td className="small">
                    <select
                      className="form-select form-select-sm"
                      value={o.status}
                      onChange={(e) => updateStatus(o._id, e.target.value)}
                    >
                      <option value="pending">Chờ xác nhận</option>
                      <option value="shipping">Đang giao</option>
                      <option value="completed">Hoàn thành</option>
                      <option value="canceled">Đã hủy</option>
                    </select>
                  </td>
                  <td className="small">
                    {o.createdAt
                      ? new Date(o.createdAt).toLocaleString()
                      : ""}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center small text-muted">
                    Chưa có đơn hàng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
