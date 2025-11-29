import { useLocation, Link } from "react-router-dom";

export default function OrderSuccess() {
  const { state } = useLocation();
  const order = state?.order;

  if (!order) {
    return (
      <div className="container my-4">
        <div className="alert alert-warning">
          Không tìm thấy thông tin đơn hàng.
        </div>
        <Link to="/" className="btn btn-primary">
          Về trang chủ
        </Link>
      </div>
    );
  }

  const freeShip = Number(order.shippingPrice || 0) === 0;

  return (
    <div className="container my-4">
      <div className="bg-white rounded-3 shadow-sm p-4">
        <h4 className="text-success mb-3">Đặt hàng thành công!</h4>

        <p className="mb-1">
          Mã đơn hàng: <strong>#{order.code}</strong>
        </p>
        <p className="mb-1">
          Tổng tiền:{" "}
          <strong>
            {Number(order.total || 0).toLocaleString("vi-VN")} đ
          </strong>
        </p>
        {freeShip ? (
          <p className="text-success mb-2">
            Đơn hàng trên 1.000.000đ - <strong>Free ship</strong>.
          </p>
        ) : (
          <p className="mb-2">
            Phí vận chuyển:{" "}
            {Number(order.shippingPrice || 0).toLocaleString("vi-VN")} đ
          </p>
        )}

        <hr />
        <p className="mb-1">
          Người nhận: <strong>{order.shippingInfo?.fullName}</strong>
        </p>
        <p className="mb-1">
          Địa chỉ: <strong>{order.shippingInfo?.address}</strong>
        </p>
        <p className="mb-3">
          SĐT: <strong>{order.shippingInfo?.phone}</strong>
        </p>

        <Link to="/" className="btn btn-primary me-2">
          Về trang chủ
        </Link>
<Link to="/profile?tab=orders" className="btn btn-outline-secondary">
  Xem lịch sử đơn hàng
</Link>

      </div>
    </div>
  );
}
