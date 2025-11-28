import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ConfirmDialog from "../components/ConfirmDialog";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!emailRegex.test(form.email)) {
      setError("Email không hợp lệ");
      setShowError(true);
      return;
    }
    if (form.password.length < 6) {
      setError("Mật khẩu phải từ 6 ký tự");
      setShowError(true);
      return;
    }
    try {
      await login(form.email, form.password);
      nav("/");
    } catch (err) {
      setError(err.response?.data?.message || "Đăng nhập thất bại");
      setShowError(true);
    }
  };

  return (
    <div className="container my-4" style={{ maxWidth: 420 }}>
      <h4 className="mb-3 text-center">Đăng nhập</h4>
      <form onSubmit={submit} className="bg-white p-3 rounded-3 shadow-sm">
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Mật khẩu</label>
          <input
            type="password"
            className="form-control"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>
        <button className="btn btn-primary w-100">Đăng nhập</button>
        <div className="mt-3 text-center small">
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </div>
      </form>

      {showError && (
        <ConfirmDialog
          title="Lỗi đăng nhập"
          message={error}
          confirmText="Đóng"
          showCancel={false}
          onClose={() => setShowError(false)}
          onConfirm={() => setShowError(false)}
        />
      )}
    </div>
  );
}
