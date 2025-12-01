import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { FiLock, FiCheck } from "react-icons/fi";

export default function ResetPassword() {
  const { token } = useParams(); // Lấy token từ URL
  const navigate = useNavigate();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return setError("Mật khẩu nhập lại không khớp");
    if (password.length < 6) return setError("Mật khẩu phải có ít nhất 6 ký tự");

    setLoading(true);
    setError("");
    try {
      await authService.resetPassword(token, password);
      setMessage("Đặt lại mật khẩu thành công! Đang chuyển hướng...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Token không hợp lệ hoặc đã hết hạn.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 bg-light d-flex align-items-center justify-content-center p-4">
      <div className="card border-0 shadow-sm p-4" style={{ maxWidth: 400, width: "100%" }}>
        <h3 className="fw-bold mb-4 text-center">Đặt lại mật khẩu mới</h3>

        {message ? (
            <div className="alert alert-success text-center">
                <FiCheck className="me-2"/> {message}
            </div>
        ) : (
            <form onSubmit={handleSubmit}>
                {error && <div className="alert alert-danger small">{error}</div>}

                <div className="mb-3">
                    <label className="form-label small fw-bold">Mật khẩu mới</label>
                    <div className="input-group">
                        <span className="input-group-text bg-white"><FiLock /></span>
                        <input 
                            type="password" 
                            className="form-control" 
                            placeholder="Ít nhất 6 ký tự"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="form-label small fw-bold">Xác nhận mật khẩu</label>
                    <div className="input-group">
                        <span className="input-group-text bg-white"><FiLock /></span>
                        <input 
                            type="password" 
                            className="form-control" 
                            placeholder="Nhập lại mật khẩu"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <button className="btn btn-primary w-100 fw-bold" disabled={loading}>
                    {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
                </button>
            </form>
        )}
      </div>
    </div>
  );
}