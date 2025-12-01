import { Link } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";

export default function OrderSuccess() {
  return (
    <div className="container py-5 my-5 text-center">
      <div className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success rounded-circle p-4 mb-4">
        <FiCheckCircle size={60} />
      </div>
      <h2 className="fw-bold mb-3">Đặt hàng thành công!</h2>
      <p className="text-muted mb-4" style={{maxWidth: 500, margin: "0 auto"}}>
        Cảm ơn bạn đã mua sắm tại PStore. Đơn hàng của bạn đang được xử lý và sẽ sớm được giao đến bạn.
      </p>
      <div className="d-flex justify-content-center gap-3">
        <Link to="/" className="btn btn-light border px-4">Về trang chủ</Link>
        <Link to="/profile?tab=orders" className="btn btn-primary px-4">Xem đơn hàng</Link>
      </div>
    </div>
  );
}