import { useState } from "react";
import { Link } from "react-router-dom";
import { FiFacebook, FiInstagram, FiYoutube, FiMapPin, FiPhone, FiMail, FiSend } from "react-icons/fi";
import { subscriberService } from "../../services/subscriberService";
import { useNotification } from "../../context/NotificationContext";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { notify } = useNotification();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      await subscriberService.subscribe(email);
      notify("Đăng ký nhận tin thành công!", "success");
      setEmail("");
    } catch (err) {
      notify(err.response?.data?.message || "Đăng ký thất bại", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-auto">
      {/* 1. NEWSLETTER SECTION */}
      <div className="bg-primary text-white py-4">
        <div className="container">
          <div className="row align-items-center g-3">
            <div className="col-md-6">
              <div className="d-flex align-items-center gap-3">
                <div className="bg-white text-primary rounded-circle p-3 shadow-sm d-none d-sm-block">
                  <FiSend size={24} />
                </div>
                <div>
                  <h5 className="fw-bold mb-1">Đăng ký nhận tin</h5>
                  <p className="mb-0 opacity-75 small">Nhận thông tin sản phẩm mới và khuyến mãi đặc biệt.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <form className="input-group" onSubmit={handleSubscribe}>
                <input 
                  type="email" 
                  className="form-control border-0 py-2" 
                  placeholder="Địa chỉ email của bạn..." 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button className="btn btn-dark fw-bold px-4" disabled={loading}>
                  {loading ? "Đang gửi..." : "Đăng ký"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN FOOTER */}
      <footer className="bg-dark text-light pt-5 pb-3" style={{ fontSize: "14px" }}>
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <Link to="/" className="text-decoration-none text-white mb-3 d-block">
                <span className="fw-bold fs-3">PStore</span>
              </Link>
              <p className="text-secondary mb-3">
                Hệ thống bán lẻ Laptop, PC, Màn hình, Gaming Gear chính hãng hàng đầu Việt Nam.
              </p>
              <div className="d-flex flex-column gap-2 text-secondary">
                <div className="d-flex gap-2"><FiMapPin className="mt-1"/><span>123 Đường Công Nghệ, Quận 1, TP.HCM</span></div>
                <div className="d-flex gap-2"><FiPhone className="mt-1"/><span>1900.5301 - 0987.654.321</span></div>
                <div className="d-flex gap-2"><FiMail className="mt-1"/><span>hotro@pstore.vn</span></div>
              </div>
            </div>

            <div className="col-lg-2 col-md-6">
              <h6 className="fw-bold text-white mb-3">Chính sách</h6>
              <ul className="list-unstyled d-flex flex-column gap-2">
                <li><Link to="/policy" className="text-secondary text-decoration-none hover-white">Chính sách bảo hành</Link></li>
                <li><Link to="/policy" className="text-secondary text-decoration-none hover-white">Chính sách đổi trả</Link></li>
                <li><Link to="/guide" className="text-secondary text-decoration-none hover-white">Hướng dẫn mua hàng</Link></li>
                <li><Link to="/contact" className="text-secondary text-decoration-none hover-white">Liên hệ</Link></li>
                <li><Link to="/faq" className="text-secondary text-decoration-none hover-white">Câu hỏi thường gặp</Link></li>
              </ul>
            </div>

            <div className="col-lg-2 col-md-6">
              <h6 className="fw-bold text-white mb-3">Sản phẩm</h6>
              <ul className="list-unstyled d-flex flex-column gap-2">
                <li><Link to="/products?categorySlug=laptop" className="text-secondary text-decoration-none hover-white">Laptop Gaming</Link></li>
                <li><Link to="/products?categorySlug=man-hinh" className="text-secondary text-decoration-none hover-white">Màn hình PC</Link></li>
                <li><Link to="/products?categorySlug=ban-phim" className="text-secondary text-decoration-none hover-white">Bàn phím cơ</Link></li>
                <li><Link to="/products?categorySlug=chuot" className="text-secondary text-decoration-none hover-white">Chuột Gaming</Link></li>
              </ul>
            </div>

            <div className="col-lg-4 col-md-6">
              <h6 className="fw-bold text-white mb-3">Kết nối với chúng tôi</h6>
              <div className="d-flex gap-3 mb-4">
                <a href="#" className="btn btn-outline-light rounded-circle p-2 d-flex align-items-center justify-content-center" style={{width: 40, height: 40}}><FiFacebook size={20}/></a>
                <a href="#" className="btn btn-outline-light rounded-circle p-2 d-flex align-items-center justify-content-center" style={{width: 40, height: 40}}><FiYoutube size={20}/></a>
                <a href="#" className="btn btn-outline-light rounded-circle p-2 d-flex align-items-center justify-content-center" style={{width: 40, height: 40}}><FiInstagram size={20}/></a>
              </div>
              <h6 className="fw-bold text-white mb-3">Thanh toán</h6>
              <div className="d-flex gap-2 flex-wrap">
                <span className="bg-light px-2 py-1 rounded text-dark fw-bold small">VISA</span>
                <span className="bg-light px-2 py-1 rounded text-dark fw-bold small">MasterCard</span>
                <span className="bg-light px-2 py-1 rounded text-dark fw-bold small">Momo</span>
                <span className="bg-light px-2 py-1 rounded text-dark fw-bold small">COD</span>
              </div>
            </div>
          </div>
          <hr className="border-secondary my-4" />
          <div className="text-center text-secondary small">
            <p className="mb-0">© 2025 PStore. All rights reserved.</p>
          </div>
        </div>
      </footer>
      <style>{`.hover-white:hover { color: #fff !important; text-decoration: underline !important; }`}</style>
    </div>
  );
}