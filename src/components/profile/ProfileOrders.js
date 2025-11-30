const formatMoney = (n) => {
  const num = typeof n === "number" ? n : Number(n || 0);
  return num.toLocaleString("vi-VN");
};

export default function ProfileOrders({ orders, orderFilter, setOrderFilter }) {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Quản lý đơn hàng</h5>
        <div className="btn-group order-tabs">
          {["all", "pending", "shipping", "completed", "canceled"].map((st) => (
            <button
              key={st}
              className={
                "btn btn-sm " +
                (orderFilter === st ? "btn-primary" : "btn-light")
              }
              onClick={() => setOrderFilter(st)}
            >
              {st === "all"
                ? "Tất cả"
                : st === "pending"
                ? "Chờ xác nhận"
                : st === "shipping"
                ? "Đang giao"
                : st === "completed"
                ? "Hoàn thành"
                : "Đã hủy"}
            </button>
          ))}
        </div>
      </div>

      {orders.length === 0 && (
        <div className="text-muted small">Bạn chưa có đơn hàng nào.</div>
      )}

      <div className="vstack gap-3">
        {orders.map((o) => (
          <div
            key={o._id}
            className="border rounded-3 p-3 bg-white d-flex flex-column flex-md-row justify-content-between gap-2"
          >
            <div>
              <div className="fw-semibold mb-1">
                Đơn #{(o._id || "").slice(-6).toUpperCase()}
              </div>
              <div className="small text-muted mb-1">
                Ngày đặt:{" "}
                {o.createdAt ? new Date(o.createdAt).toLocaleString() : ""}
              </div>
              <div className="small mb-1">
                Người nhận: {o.shippingInfo?.fullName} –{" "}
                {o.shippingInfo?.phone}
              </div>
              <div className="small text-muted mb-1">
                Địa chỉ: {o.shippingInfo?.address}
              </div>
              <div className="small">
                {o.items?.map((it) => (
                  <div key={it._id}>
                    {it.nameSnapshot} x {it.qty} (
                    {formatMoney(it.priceSnapshot)} đ)
                  </div>
                ))}
              </div>
            </div>
            <div className="text-md-end">
              <div className="fw-semibold mb-1">
                Tổng tiền: {formatMoney(o.total)} đ
              </div>
              <div>
                {o.status === "pending" && (
                  <span className="badge bg-warning text-dark">
                    Chờ xác nhận
                  </span>
                )}
                {o.status === "shipping" && (
                  <span className="badge bg-info text-dark">
                    Đang vận chuyển
                  </span>
                )}
                {o.status === "completed" && (
                  <span className="badge bg-success">Hoàn thành</span>
                )}
                {o.status === "canceled" && (
                  <span className="badge bg-secondary">Đã hủy</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
