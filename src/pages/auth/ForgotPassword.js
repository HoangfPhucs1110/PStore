import { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../../services/authService";
import { FiArrowLeft, FiMail, FiCheckCircle } from "react-icons/fi";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await authService.forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 bg-white d-flex align-items-center justify-content-center p-4">
      <div style={{ maxWidth: 400, width: "100%" }}>
        <Link to="/login" className="text-decoration-none text-muted mb-4 d-inline-flex align-items-center gap-2">
          <FiArrowLeft /> Quay lại đăng nhập
        </Link>

        {success ? (
          <div className="text-center animate-fade-in">
            <div className="mb-3 text-success bg-success bg-opacity-10 p-3 rounded-circle d-inline-flex">
                <FiCheckCircle size={40}/>
            </div>
            <h3 className="fw-bold">Đã gửi email!</h3>
            <p className="text-muted">
                Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến <strong>{email}</strong>. 
                Vui lòng kiểm tra hộp thư (kể cả mục Spam).
            </p>
            <Link to="/login" className="btn btn-primary w-100 mt-3">Quay về trang đăng nhập</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3 className="fw-bold mb-2">Quên mật khẩu? 🔒</h3>
            <p className="text-muted mb-4">Nhập email của bạn để nhận liên kết đặt lại mật khẩu.</p>

            {error && <div className="alert alert-danger small">{error}</div>}

            <div className="mb-4">
              <label className="form-label small fw-bold">Email đăng ký</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0"><FiMail /></span>
                <input 
                  type="email" 
                  className="form-control bg-light border-start-0 ps-0" 
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button className="btn btn-primary w-100 py-2 fw-bold" disabled={loading}>
              {loading ? "Đang gửi..." : "Gửi yêu cầu"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}