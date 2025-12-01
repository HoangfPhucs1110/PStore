import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { orderService } from "../../services/orderService";
import { useCart } from "../../context/CartContext"; // Import Cart
import { FiCheckCircle, FiXCircle, FiHome, FiRotateCcw } from "react-icons/fi";

export default function PaymentResult() {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart(); // Lấy hàm clearCart
  const [status, setStatus] = useState("loading"); // loading, success, fail
  const hasCalled = useRef(false);

  useEffect(() => {
    if (hasCalled.current) return;
    hasCalled.current = true;

    // Lấy thông tin từ URL
    const orderCode = searchParams.get("orderCode");
    const isCancel = searchParams.get("cancel") === "true";
    const statusParam = searchParams.get("status");

    // Nếu không có mã đơn hoặc trạng thái là hủy -> Fail
    if (!orderCode || isCancel || statusParam !== "PAID") {
        setStatus("fail");
        // Backend tự động xóa đơn hàng pending khi gọi API verify bên dưới
        // Hoặc nếu không gọi API, đơn hàng treo sẽ được xử lý sau.
        // Tốt nhất vẫn gọi API để Backend biết mà xóa.
        if (orderCode) orderService.getPaymentInfo(orderCode).catch(()=>{});
        return;
    }

    // Gọi API Verify
    orderService.getPaymentInfo(orderCode)
        .then(res => {
            if (res.code === "00") {
                setStatus("success");
                clearCart(); // --- QUAN TRỌNG: Chỉ xóa giỏ khi thành công ---
            } else {
                setStatus("fail");
            }
        })
        .catch(() => setStatus("fail"));

  }, [searchParams, clearCart]);

  return (
    <div className="bg-light min-vh-100 d-flex flex-column justify-content-center align-items-center p-3">
      <div className="card border-0 shadow-lg rounded-4 overflow-hidden text-center animate-fade-in" style={{maxWidth: 480, width: "100%"}}>
        
        {/* --- TRẠNG THÁI LOADING --- */}
        {status === "loading" && (
            <div className="p-5">
                <div className="spinner-border text-primary mb-3" style={{width: "3rem", height: "3rem"}} role="status"></div>
                <h5 className="fw-bold text-dark">Đang xử lý giao dịch...</h5>
                <p className="text-muted mb-0">Vui lòng không tắt trình duyệt.</p>
            </div>
        )}

        {/* --- TRẠNG THÁI THÀNH CÔNG --- */}
        {status === "success" && (
            <>
                <div className="bg-success text-white py-5">
                    <FiCheckCircle size={80} className="mb-3 animate-bounce" />
                    <h2 className="fw-bold mb-0">Thanh toán thành công!</h2>
                </div>
                <div className="card-body p-4">
                    <p className="text-muted mb-4">
                        Cảm ơn bạn đã mua sắm tại PStore.<br/>
                        Đơn hàng của bạn đã được xác nhận và đang xử lý.
                    </p>
                    <div className="d-flex flex-column gap-3">
                        <Link to="/profile?tab=orders" className="btn btn-primary btn-lg fw-bold shadow-sm">
                            Xem đơn hàng của tôi
                        </Link>
                        <Link to="/" className="btn btn-outline-secondary fw-medium">
                            <FiHome className="me-2"/> Về trang chủ
                        </Link>
                    </div>
                </div>
            </>
        )}

        {/* --- TRẠNG THÁI THẤT BẠI --- */}
        {status === "fail" && (
            <>
                <div className="bg-danger text-white py-5">
                    <FiXCircle size={80} className="mb-3 animate-shake" />
                    <h2 className="fw-bold mb-0">Giao dịch thất bại!</h2>
                </div>
                <div className="card-body p-4">
                    <p className="text-muted mb-4">
                        Giao dịch đã bị hủy hoặc xảy ra lỗi trong quá trình thanh toán.<br/>
                        Đơn hàng chưa được tạo. Giỏ hàng của bạn vẫn được giữ nguyên.
                    </p>
                    <div className="d-flex flex-column gap-3">
                        <Link to="/checkout" className="btn btn-danger btn-lg fw-bold shadow-sm">
                            <FiRotateCcw className="me-2"/> Thử thanh toán lại
                        </Link>
                        <Link to="/" className="btn btn-outline-secondary fw-medium">
                            <FiHome className="me-2"/> Về trang chủ
                        </Link>
                    </div>
                </div>
            </>
        )}
      </div>

      <style>{`
        @keyframes bounce { 0%, 20%, 50%, 80%, 100% {transform: translateY(0);} 40% {transform: translateY(-10px);} 60% {transform: translateY(-5px);} }
        .animate-bounce { animation: bounce 2s infinite; }
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}