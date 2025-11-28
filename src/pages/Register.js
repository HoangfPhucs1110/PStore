import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ConfirmDialog from "../components/ConfirmDialog";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: ""
  });
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Vui lòng nhập họ tên");
      setShowError(true);
      return;
    }
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
    if (form.password !== form.confirm) {
      setError("Mật khẩu nhập lại không khớp");
      setShowError(true);
      return;
    }
    try {
      await register(form.name, form.email, form.password);
      nav("/");
    } catch (err) {
      setError(err.response?.data?.message || "Đăng ký thất bại");
      setShowError(true);
    }
  };

  return (
    <div className="container my-4" style={{ maxWidth: 420 }}>
      <h4 className="mb-3 text-center">Đăng ký tài khoản</h4>
      <form onSubmit={submit} className="bg-white p-3 rounded-3 shadow-sm">
        <div className="mb-3">
          <label className="form-label">Họ tên</label>
          <input
            className="form-control"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
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
        <div className="mb-3">
          <label className="form-label">Nhập lại mật khẩu</label>
          <input
            type="password"
            className="form-control"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            required
          />
        </div>
        <button className="btn btn-primary w-100">Đăng ký</button>
        <div className="mt-3 text-center small">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </div>
      </form>

      {showError && (
        <ConfirmDialog
          title="Lỗi đăng ký"
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
