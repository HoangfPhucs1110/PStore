import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import { FiArrowLeft, FiUser, FiMail, FiLock } from "react-icons/fi";

export default function Register() {
  const { register } = useAuth();
  const { notify } = useNotification();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.password.length < 6) {
        return notify("Mật khẩu phải từ 6 ký tự trở lên", "warning");
    }
    if (form.password !== form.confirmPassword) {
        return notify("Mật khẩu nhập lại không khớp", "warning");
    }

    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      notify("Đăng ký thành công! Chào mừng bạn đến với PStore.", "success");
      navigate("/");
    } catch (err) {
      notify(err.response?.data?.message || "Đăng ký thất bại", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 bg-white">
      <div className="row min-vh-100">
        
        {/* Cột Trái: Banner Ảnh (Đổi vị trí so với Login cho đỡ nhàm chán - hoặc giữ nguyên tùy bạn) */}
        {/* Ở đây tôi để Banner bên TRÁI cho trang Register */}
        <div className="col-md-6 col-lg-7 d-none d-md-block p-0 position-relative bg-light">
          <img 
            src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=2042&auto=format&fit=crop" 
            alt="Register Banner" 
            className="w-100 h-100 object-fit-cover"
          />
          <div className="position-absolute top-0 end-0 w-100 h-100" style={{background: "linear-gradient(to left, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 20%)"}}></div>
          <div className="position-absolute bottom-0 start-0 p-5 text-white w-100" style={{background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)"}}>
            <h3 className="fw-bold">Tham gia cộng đồng PStore</h3>
            <p className="mb-0 opacity-75">Nhận ưu đãi độc quyền và cập nhật công nghệ mới nhất.</p>
          </div>
        </div>

        {/* Cột Phải: Form Đăng Ký */}
        <div className="col-md-6 col-lg-5 d-flex align-items-center justify-content-center p-5">
          <div style={{ width: "100%", maxWidth: 400 }}>
            <Link to="/" className="text-decoration-none text-muted mb-4 d-inline-flex align-items-center gap-2 hover-text-primary">
              <FiArrowLeft /> Về trang chủ
            </Link>
            
            <div className="mb-4">
              <h2 className="fw-bold text-dark mb-1">Tạo tài khoản mới 🚀</h2>
              <p className="text-secondary">Chỉ mất chưa đầy 1 phút để bắt đầu.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold">Họ và tên</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted"><FiUser /></span>
                  <input 
                    className="form-control bg-light border-start-0 ps-0" 
                    placeholder="Nguyễn Văn A"
                    value={form.name} 
                    onChange={e => setForm({...form, name: e.target.value})} 
                    required 
                  />
                </div>
              </div>

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

              <div className="mb-3">
                <label className="form-label small fw-bold">Mật khẩu</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted"><FiLock /></span>
                  <input 
                    type="password" 
                    className="form-control bg-light border-start-0 ps-0" 
                    placeholder="Tối thiểu 6 ký tự"
                    value={form.password} 
                    onChange={e => setForm({...form, password: e.target.value})} 
                    required 
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold">Nhập lại mật khẩu</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted"><FiLock /></span>
                  <input 
                    type="password" 
                    className="form-control bg-light border-start-0 ps-0" 
                    placeholder="Xác nhận mật khẩu"
                    value={form.confirmPassword} 
                    onChange={e => setForm({...form, confirmPassword: e.target.value})} 
                    required 
                  />
                </div>
              </div>

              <button className="btn btn-primary w-100 py-2 fw-bold shadow-sm" disabled={loading}>
                {loading ? "Đang tạo tài khoản..." : "Đăng ký ngay"}
              </button>
            </form>

            <div className="text-center mt-4 text-muted small">
              Đã có tài khoản? <Link to="/login" className="fw-bold text-primary text-decoration-none">Đăng nhập</Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}