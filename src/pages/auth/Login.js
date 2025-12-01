import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import { FiArrowLeft, FiMail, FiLock } from "react-icons/fi";

export default function Login() {
  const { login } = useAuth();
  const { notify } = useNotification();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      notify("Đăng nhập thành công!", "success");
      navigate("/");
    } catch (err) {
      notify(err.response?.data?.message || "Email hoặc mật khẩu không đúng", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 bg-white">
      <div className="row min-vh-100">
        
        <div className="col-md-6 col-lg-5 d-flex align-items-center justify-content-center p-5">
          <div style={{ width: "100%", maxWidth: 400 }}>
            <Link to="/" className="text-decoration-none text-muted mb-4 d-inline-flex align-items-center gap-2 hover-text-primary">
              <FiArrowLeft /> Quay lại trang chủ
            </Link>
            
            <div className="mb-4">
              <h2 className="fw-bold text-dark mb-1">Chào mừng trở lại! 👋</h2>
              <p className="text-secondary">Vui lòng nhập thông tin để đăng nhập.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold">Email</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted"><FiMail /></span>
                  <input 
                    type="email" 
                    className="form-control bg-light border-start-0 ps-0" 
                    placeholder="name@example.com"
                    value={form.email} 
                    onChange={e => setForm({...form, email: e.target.value})} 
                    required 
                  />
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label small fw-bold m-0">Mật khẩu</label>
                  {/* --- SỬA LINK QUÊN MẬT KHẨU TẠI ĐÂY --- */}
                  <Link to="/forgot-password" className="small text-decoration-none text-primary">Quên mật khẩu?</Link>
                </div>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted"><FiLock /></span>
                  <input 
                    type="password" 
                    className="form-control bg-light border-start-0 ps-0" 
                    placeholder="••••••••"
                    value={form.password} 
                    onChange={e => setForm({...form, password: e.target.value})} 
                    required 
                  />
                </div>
              </div>

              <button className="btn btn-primary w-100 py-2 fw-bold shadow-sm" disabled={loading}>
                {loading ? "Đang xử lý..." : "Đăng nhập ngay"}
              </button>
            </form>

            <div className="text-center mt-4 text-muted small">
              Chưa có tài khoản?
              <Link to="/register" className="fw-bold text-primary text-decoration-none ms-1">Đăng ký miễn phí</Link>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-7 d-none d-md-block p-0 position-relative bg-light">
          <img 
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop" 
            alt="Login Banner" 
            className="w-100 h-100 object-fit-cover"
          />
          <div className="position-absolute top-0 start-0 w-100 h-100" style={{background: "linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 20%)"}}></div>
          <div className="position-absolute bottom-0 start-0 p-5 text-white" style={{background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)"}}>
            <h3 className="fw-bold">PStore Gaming Gear</h3>
            <p className="mb-0 opacity-75">Nơi cung cấp thiết bị công nghệ chính hãng hàng đầu Việt Nam.</p>
          </div>
        </div>

      </div>
    </div>
  );
}