import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { subscriberService } from "../../services/subscriberService";
import { FiCheckCircle, FiAlertCircle, FiLoader } from "react-icons/fi";

export default function Unsubscribe() {
  const [params] = useSearchParams();
  const email = params.get("email");
  const [status, setStatus] = useState("loading"); // loading | success | error
  
  // Dùng useRef để đảm bảo chỉ gọi API 1 lần duy nhất (Fix lỗi React StrictMode)
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!email) {
      setStatus("error");
      return;
    }

    // Nếu đã gọi rồi thì không gọi lại nữa
    if (hasFetched.current) return;
    hasFetched.current = true;

    // Gọi API
    subscriberService.unsubscribe(email)
      .then(() => {
        setStatus("success");
      })
      .catch((err) => {
        console.error("Lỗi hủy đăng ký:", err);
        
        // QUAN TRỌNG: Nếu lỗi là 404 (Email không tồn tại) -> Coi như thành công
        // (Vì mục đích là email không còn trong DB nữa)
        if (err.response && err.response.status === 404) {
            setStatus("success");
        } else {
            setStatus("error");
        }
      });
  }, [email]);

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div className="card border-0 shadow-sm p-5 text-center" style={{ maxWidth: 500, width: "90%", borderRadius: 16 }}>
        
        {/* TRẠNG THÁI LOADING */}
        {status === "loading" && (
            <>
                <div className="spinner-border text-primary mb-3" style={{width: "3rem", height: "3rem"}} role="status"></div>
                <h5 className="fw-bold text-dark">Đang xử lý yêu cầu...</h5>
                <p className="text-muted small mb-0">Vui lòng chờ trong giây lát.</p>
            </>
        )}
        
        {/* TRẠNG THÁI THÀNH CÔNG */}
        {status === "success" && (
            <div className="animate-fade-in">
                <div className="mb-3 d-inline-flex bg-success bg-opacity-10 text-success rounded-circle p-3">
                    <FiCheckCircle size={48} />
                </div>
                <h4 className="fw-bold mb-2 text-dark">Hủy đăng ký thành công</h4>
                <p className="text-secondary mb-4">
                    Email <strong className="text-dark">{email}</strong> đã được loại bỏ khỏi danh sách nhận tin của PStore. 
                    Bạn sẽ không còn nhận được email từ chúng tôi nữa.
                </p>
                <Link to="/" className="btn btn-primary px-4 rounded-pill fw-medium">
                    Về trang chủ
                </Link>
            </div>
        )}

        {/* TRẠNG THÁI LỖI */}
        {status === "error" && (
            <div className="animate-fade-in">
                <div className="mb-3 d-inline-flex bg-danger bg-opacity-10 text-danger rounded-circle p-3">
                    <FiAlertCircle size={48} />
                </div>
                <h4 className="fw-bold mb-2 text-dark">Đường dẫn không hợp lệ</h4>
                <p className="text-secondary mb-4">
                    Link hủy đăng ký bị thiếu thông tin hoặc sai định dạng. <br/>
                    Vui lòng kiểm tra lại đường dẫn trong email của bạn.
                </p>
                <Link to="/" className="btn btn-outline-secondary px-4 rounded-pill fw-medium">
                    Về trang chủ
                </Link>
            </div>
        )}
      </div>
    </div>
  );
}