import React, { useState } from "react";
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend, FiUser, FiTag, FiMessageSquare } from "react-icons/fi";
import { useNotification } from "../../context/NotificationContext";
import { contactService } from "../../services/contactService"; // <--- QUAN TRỌNG: Import service

export default function Contact() {
  const { notify } = useNotification();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false); // Thêm trạng thái loading

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Kiểm tra dữ liệu cơ bản
    if (!form.name || !form.email || !form.message) {
        return notify("Vui lòng điền đầy đủ thông tin", "warning");
    }

    setLoading(true);
    try {
        // Gọi API gửi liên hệ
        await contactService.create(form);
        notify("Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất!", "success");
        setForm({ name: "", email: "", subject: "", message: "" }); // Reset form
    } catch (err) {
        notify(err.response?.data?.message || "Gửi thất bại. Vui lòng thử lại sau.", "error");
    } finally {
        setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <FiMapPin size={32} className="text-primary mb-3" />,
      title: "Địa chỉ",
      desc: "123 Đường Công Nghệ, Quận 1, TP.HCM",
      link: "https://maps.google.com"
    },
    {
      icon: <FiPhone size={32} className="text-primary mb-3" />,
      title: "Hotline",
      desc: "1900 5301 - 0987 654 321",
      link: "tel:19005301"
    },
    {
      icon: <FiMail size={32} className="text-primary mb-3" />,
      title: "Email",
      desc: "hotro@pstore.vn",
      link: "mailto:hotro@pstore.vn"
    },
    {
      icon: <FiClock size={32} className="text-primary mb-3" />,
      title: "Giờ làm việc",
      desc: "08:00 - 21:30 (Hàng ngày)",
      link: null
    }
  ];

  return (
    <div className="bg-light min-vh-100 font-sans py-5">
      <div className="container">
        
        {/* 1. HEADER SECTION */}
        <div className="text-center mb-5">
          <h1 className="fw-bold display-5 text-dark mb-3">Liên hệ với PStore</h1>
          <p className="text-secondary fs-5 mx-auto" style={{ maxWidth: "600px" }}>
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy chọn phương thức liên hệ phù hợp nhất bên dưới.
          </p>
        </div>

        {/* 2. INFO CARDS GRID */}
        <div className="row g-4 mb-5">
          {contactInfo.map((item, index) => (
            <div className="col-md-6 col-lg-3" key={index}>
              <a 
                href={item.link || "#"} 
                className={`card h-100 border-0 shadow-sm rounded-4 hover-lift text-decoration-none contact-card ${!item.link ? 'cursor-default' : ''}`}
                onClick={e => !item.link && e.preventDefault()}
              >
                <div className="card-body p-4 text-center">
                  <div className="position-relative z-1">
                    {item.icon}
                    <h5 className="fw-bold text-dark mb-2">{item.title}</h5>
                    <p className="text-muted small mb-0">{item.desc}</p>
                  </div>
                </div>
                {/* Thanh màu trang trí dưới đáy */}
                <div className="mt-auto bg-primary" style={{ height: "4px", width: "0%", transition: "width 0.3s ease" }}></div>
              </a>
            </div>
          ))}
        </div>

        {/* 3. CONTACT FORM SECTION */}
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="row g-0">
                
                {/* Cột trái: Hình ảnh/Decor */}
                <div className="col-lg-5 d-none d-lg-block bg-primary position-relative overflow-hidden p-5 text-white d-flex flex-column justify-content-center">
                    
                    <div className="position-relative z-1">
                        <FiMessageSquare size={48} className="mb-4" />
                        <h3 className="fw-bold mb-3">Gửi tin nhắn</h3>
                        <p className="opacity-75 mb-0">
                            Nếu bạn có thắc mắc về đơn hàng hoặc sản phẩm, đừng ngần ngại để lại lời nhắn. Đội ngũ CSKH sẽ phản hồi trong vòng 24h.
                        </p>
                    </div>
                </div>

                {/* Cột phải: Form nhập liệu */}
                <div className="col-lg-7 bg-white p-4 p-md-5">
                  <h4 className="fw-bold text-dark mb-4 d-lg-none">Gửi tin nhắn</h4>
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted">Họ tên</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-0 text-primary"><FiUser/></span>
                            <input className="form-control bg-light border-0 py-2" required value={form.name} onChange={e=>setForm({...form, name: e.target.value})} placeholder="Tên của bạn" />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted">Email</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-0 text-primary"><FiMail/></span>
                            <input type="email" className="form-control bg-light border-0 py-2" required value={form.email} onChange={e=>setForm({...form, email: e.target.value})} placeholder="email@example.com" />
                        </div>
                      </div>
                      <div className="col-12">
                        <label className="form-label small fw-bold text-muted">Chủ đề</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-0 text-primary"><FiTag/></span>
                            <input className="form-control bg-light border-0 py-2" required value={form.subject} onChange={e=>setForm({...form, subject: e.target.value})} placeholder="Bạn cần hỗ trợ gì?" />
                        </div>
                      </div>
                      <div className="col-12">
                        <label className="form-label small fw-bold text-muted">Nội dung</label>
                        <textarea className="form-control bg-light border-0 py-2" rows="4" required value={form.message} onChange={e=>setForm({...form, message: e.target.value})} placeholder="Nhập nội dung tin nhắn..." />
                      </div>
                      <div className="col-12 mt-4 text-end">
                        <button type="submit" className="btn btn-primary px-5 py-2 rounded-pill fw-bold shadow-sm d-inline-flex align-items-center gap-2 hover-scale" disabled={loading}>
                          {loading ? "Đang gửi..." : <><FiSend /> Gửi ngay</>}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>

      {/* CSS Styles */}
      <style>{`
        .hover-lift {
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
        }
        .contact-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.08) !important;
        }
        .contact-card:hover .bg-primary {
          width: 100% !important;
        }
        .hover-scale:hover {
          transform: scale(1.05);
          transition: 0.2s;
        }
        .cursor-default { cursor: default; }
      `}</style>
    </div>
  );
}