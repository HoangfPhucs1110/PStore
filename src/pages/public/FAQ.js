import React from 'react';
import { FiHelpCircle, FiSearch, FiChevronDown } from 'react-icons/fi';

const faqData = [
  { 
    q: "Làm thế nào để tra cứu đơn hàng?",
    a: "Bạn chỉ cần click vào biểu tượng xe tải ở Header, sau đó nhập Số điện thoại và Mã đơn hàng để xem chi tiết."
  },
  { 
    q: "Tôi có cần tài khoản để mua hàng không?",
    a: "Không bắt buộc. Tuy nhiên, việc đăng ký tài khoản sẽ giúp bạn tích điểm, lưu địa chỉ và theo dõi đơn hàng dễ dàng hơn."
  },
  { 
    q: "PStore chấp nhận hình thức thanh toán nào?",
    a: "Chúng tôi hỗ trợ: Thanh toán khi nhận hàng (COD), Chuyển khoản ngân hàng (QR Code PayOS), và thẻ Visa/Mastercard."
  },
  { 
    q: "Chính sách hoàn tiền như thế nào?",
    a: "Nếu đơn hàng thanh toán online bị hủy hoặc lỗi, tiền sẽ được hoàn về tài khoản của bạn trong vòng 24h - 48h làm việc."
  },
  { 
    q: "Sản phẩm có được bảo hành chính hãng không?",
    a: "100% sản phẩm tại PStore là hàng chính hãng, được hưởng đầy đủ chế độ bảo hành của nhà sản xuất tại Việt Nam."
  },
  { 
    q: "Phí vận chuyển được tính ra sao?",
    a: "Miễn phí vận chuyển cho đơn hàng từ 1.000.000đ. Đơn dưới 1 triệu đồng phí ship đồng giá 30.000đ toàn quốc."
  }
];

export default function FAQ() {
  return (
    <div className="bg-light min-vh-100 font-sans pb-5">
      {/* HERO SEARCH */}
      <div className="bg-white py-5 border-bottom">
        <div className="container text-center">
          <div className="mb-4 d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle" style={{width: 60, height: 60}}>
            <FiHelpCircle size={30} />
          </div>
          <h2 className="fw-bold mb-3 text-dark">Chúng tôi có thể giúp gì cho bạn?</h2>
          
          <div className="mx-auto position-relative" style={{maxWidth: 500}}>
            <input 
              type="text" 
              className="form-control form-control-lg border-0 bg-light shadow-inner ps-5 rounded-pill" 
              placeholder="Tìm kiếm câu hỏi..." 
            />
            <FiSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={20}/>
          </div>
        </div>
      </div>

      {/* FAQ LIST */}
      <div className="container py-5" style={{maxWidth: 800}}>
        <div className="accordion" id="faqAccordion">
          {faqData.map((item, index) => (
            <div className="card border-0 shadow-sm rounded-3 mb-3 overflow-hidden faq-card" key={index}>
              <div className="card-header bg-white border-0 p-0" id={`heading${index}`}>
                <button 
                  className="accordion-button collapsed fw-bold text-dark bg-white shadow-none py-4 px-4" 
                  type="button" 
                  data-bs-toggle="collapse" 
                  data-bs-target={`#collapse${index}`} 
                  aria-expanded="false" 
                >
                  {item.q}
                </button>
              </div>
              <div 
                id={`collapse${index}`} 
                className="accordion-collapse collapse" 
                data-bs-parent="#faqAccordion"
              >
                <div className="card-body px-4 pb-4 pt-0 text-secondary" style={{lineHeight: "1.6"}}>
                  {item.a}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CONTACT SUPPORT */}
        <div className="text-center mt-5">
          <p className="text-muted mb-3">Không tìm thấy câu trả lời bạn cần?</p>
          <button className="btn btn-outline-primary rounded-pill px-4 fw-bold">Liên hệ hỗ trợ ngay</button>
        </div>
      </div>

      <style>{`
        .accordion-button:not(.collapsed) {
          color: var(--primary) !important;
          background-color: #f8fafc !important;
          box-shadow: none !important;
        }
        .accordion-button:focus { box-shadow: none !important; }
        .faq-card { transition: transform 0.2s; }
        .faq-card:hover { transform: translateY(-2px); }
      `}</style>
    </div>
  );
}