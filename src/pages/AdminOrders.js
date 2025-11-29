import { useEffect, useState } from "react";
import api from "../api";
import ConfirmDialog from "../components/ConfirmDialog";

const formatMoney = (n) => {
  const num = typeof n === "number" ? n : Number(n || 0);
  return num.toLocaleString();
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const load = () =>
    api.get("/orders").then((res) => {
      setOrders(res.data || []);
    });

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    setOrders((prev) =>
      prev.map((o) => (o._id === id ? { ...o, status } : o))
    );
  };

  const askDelete = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/orders/${deleteId}`);
      setOrders((prev) => prev.filter((o) => o._id !== deleteId));
    } catch (e) {
      console.error(e);
    } finally {
      setConfirmOpen(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="container my-3">
      <button className="btn btn-light mb-3" onClick={() => window.history.back()}>
  ← Quay lại
</button>

      <h5 className="mb-3">Quản lý đơn hàng (Admin)</h5>
      <div className="bg-white rounded-3 shadow-sm p-3">
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>SĐT</th>
                <th>Địa chỉ</th>
                <th>Ngày đặt</th>
                <th className="text-end">Tổng tiền</th>
                <th>Trạng thái</th>
                <th className="text-center">Thao tác</th>
              </tr>
            </thead>
<tbody>
  {orders.map((o, index) => (
    <tr key={o._id}>
      <td>{index + 1}</td>
      <td>{o.code || o._id.slice(-7)}</td>
      <td>{o.shippingInfo?.fullName || o.userId?.name}</td>
      <td>{o.shippingInfo?.phone}</td>
      <td>{o.shippingInfo?.address}</td>

      <td>
        {o.createdAt &&
          new Date(o.createdAt).toLocaleString("vi-VN")}
      </td>

      {/* SỬA LỖI: o.totalAmount → o.total */}
      <td className="text-end">
        {formatMoney(o.total)} đ
      </td>

      <td>
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

      {/* GHI CHÚ MỚI */}
      <td>{o.note?.trim() ? o.note : "Không có"}</td>

      <td className="text-center">
        <button
          className="btn btn-outline-danger btn-sm"
          onClick={() => askDelete(o._id)}
        >
          Xóa
        </button>
      </td>
    </tr>
  ))}

  {orders.length === 0 && (
    <tr>
      <td colSpan="10" className="text-center small text-muted">
        Chưa có đơn hàng nào.
      </td>
    </tr>
  )}
</tbody>

          </table>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Xóa đơn hàng"
        message="Bạn có chắc chắn muốn xóa đơn hàng này? Hành động không thể hoàn tác."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
