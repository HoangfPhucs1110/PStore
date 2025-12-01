import React from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiShoppingCart, FiCreditCard, FiTruck, FiArrowRight } from "react-icons/fi";

export default function Guide() {
  const steps = [
    {
      id: "01",
      icon: <FiSearch size={48} className="text-primary mb-3" />, // Icon lớn, màu xanh primary
      title: "Tìm kiếm sản phẩm",
      desc: "Sử dụng thanh tìm kiếm thông minh hoặc duyệt qua danh mục để tìm món đồ công nghệ ưng ý nhất."
    },
    {
      id: "02",
      icon: <FiShoppingCart size={48} className="text-primary mb-3" />,
      title: "Thêm vào giỏ",
      desc: "Lựa chọn phiên bản, màu sắc và số lượng phù hợp, sau đó thêm sản phẩm vào giỏ hàng của bạn."
    },
    {
      id: "03",
      icon: <FiCreditCard size={48} className="text-primary mb-3" />,
      title: "Thanh toán & Xác nhận",
      desc: "Nhập thông tin giao hàng, áp dụng mã giảm giá (nếu có) và chọn phương thức thanh toán an toàn."
    },
    {
      id: "04",
      icon: <FiTruck size={48} className="text-primary mb-3" />,
      title: "Giao hàng tận nơi",
      desc: "Đơn hàng sẽ được đóng gói cẩn thận và giao đến tận tay bạn trong thời gian sớm nhất."
    }
  ];

  return (
    <div className="bg-light min-vh-100 font-sans py-5">
      {/* 1. HERO SECTION */}
      <div className="container text-center mb-5">
        {/* Đã xóa cái khung xanh "Hỗ trợ khách hàng" ở đây */}
        <h1 className="fw-bold display-5 text-dark mb-3">Quy trình mua hàng đơn giản</h1>
        <p className="text-secondary fs-5 mx-auto" style={{ maxWidth: "600px" }}>
          Trải nghiệm mua sắm công nghệ dễ dàng tại PStore chỉ với 4 bước.
        </p>
      </div>

      {/* 2. STEPS GRID */}
      <div className="container">
        <div className="row g-4">
          {steps.map((step, index) => (
            <div className="col-md-6 col-lg-3" key={index}>
              <div className="card h-100 border-0 shadow-sm rounded-4 hover-lift position-relative overflow-hidden step-card">
                <div className="card-body p-4 text-center">
                  
                  {/* Số thứ tự mờ làm nền (Giữ lại) */}
                  <div className="position-absolute top-0 end-0 me-n2 mt-n2 text-light fw-bold" style={{ fontSize: "6rem", opacity: 0.3, lineHeight: 1, zIndex: 0 }}>
                    {step.id}
                  </div>

                  {/* Icon (Render trực tiếp, không còn khung xanh bao quanh) */}
                  <div className="position-relative z-1">
                    {step.icon}
                  </div>

                  {/* Nội dung */}
                  <div className="position-relative z-1">
                    <h5 className="fw-bold text-dark mb-3">{step.title}</h5>
                    <p className="text-muted small mb-0" style={{ lineHeight: "1.6" }}>
                      {step.desc}
                    </p>
                  </div>

                </div>
                
                {/* Thanh line màu dưới chân card */}
                <div className="mt-auto bg-primary" style={{ height: "4px", width: "0%", transition: "width 0.3s ease" }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* 3. CALL TO ACTION */}
        <div className="row justify-content-center mt-5 pt-4">
          <div className="col-lg-8">
            <div className="bg-primary text-white rounded-4 p-5 text-center shadow-lg position-relative overflow-hidden">
              {/* Decorative Circles (Giữ lại để tạo hiệu ứng nền) */}
              <div className="position-absolute top-0 start-0 translate-middle bg-white opacity-10 rounded-circle" style={{ width: "200px", height: "200px" }}></div>
              <div className="position-absolute bottom-0 end-0 translate-middle-x bg-white opacity-10 rounded-circle" style={{ width: "150px", height: "150px" }}></div>

              <div className="position-relative z-1">
                <h3 className="fw-bold mb-3">Bạn đã sẵn sàng?</h3>
                <p className="mb-4 opacity-75 fs-5">Khám phá hàng ngàn sản phẩm công nghệ đỉnh cao ngay hôm nay.</p>
                <Link to="/products" className="btn btn-light text-primary px-5 py-3 rounded-pill fw-bold shadow-sm d-inline-flex align-items-center gap-2 hover-scale">
                  Bắt đầu mua sắm <FiArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Styles nhúng */}
      <style>{`
        .hover-lift {
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
        }
        .step-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.08) !important;
        }
        .step-card:hover .bg-primary {
          width: 100% !important;
        }
        .hover-scale:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}