// src/pages/Contact.jsx
export default function Contact() {
  return (
    <div className="bg-light py-5">
      <div className="container">
        {/* HEADER */}
        <div className="mb-4">
          <h2 className="fw-bold mb-2">Liên hệ PStore</h2>
          <p className="text-muted mb-0">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn về tư vấn cấu hình, đơn hàng và dịch vụ bảo hành.
          </p>
        </div>

        <div className="row g-4">
          {/* THÔNG TIN */}
          <div className="col-lg-5">
            <div className="p-3 bg-white rounded-3 shadow-sm mb-3">
              <h6 className="fw-semibold mb-2">Thông tin liên lạc</h6>
              <p className="small mb-1">Địa chỉ: 123 PStore Street, Quận 1, TP.HCM</p>
              <p className="small mb-1">Hotline mua hàng: 1900.5301 (8:00 – 21:00)</p>
              <p className="small mb-1">Bảo hành: 1900.5325</p>
              <p className="small mb-0">Email: cs@pstore.vn</p>
            </div>

            <div className="p-3 bg-white rounded-3 shadow-sm mb-3">
              <h6 className="fw-semibold mb-2">Giờ làm việc</h6>
              <p className="small mb-1">Thứ 2 – Thứ 7: 8:00 – 21:00</p>
              <p className="small mb-0">Chủ nhật & ngày lễ: 9:00 – 18:00</p>
            </div>

            <div className="p-3 bg-white rounded-3 shadow-sm">
              <h6 className="fw-semibold mb-2">Kênh online</h6>
              <p className="small text-muted mb-2">
                Bạn có thể chat nhanh với PStore qua các nền tảng sau:
              </p>
              <div className="d-flex flex-wrap gap-2 small">
                <span className="badge bg-primary">Facebook</span>
                <span className="badge bg-danger">YouTube</span>
                <span className="badge bg-info text-dark">Zalo</span>
              </div>
            </div>
          </div>

          {/* FORM DEMO */}
          <div className="col-lg-7">
            <div className="p-4 bg-white rounded-3 shadow-sm h-100">
              <h6 className="fw-semibold mb-3">Gửi góp ý / yêu cầu hỗ trợ</h6>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small">Họ tên</label>
                  <input
                    className="form-control form-control-sm"
                    placeholder="Nhập họ tên của bạn"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small">Email</label>
                  <input
                    className="form-control form-control-sm"
                    placeholder="you@example.com"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small">Số điện thoại</label>
                  <input
                    className="form-control form-control-sm"
                    placeholder="SĐT liên hệ"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small">Loại yêu cầu</label>
                  <select className="form-select form-select-sm">
                    <option>Tư vấn mua hàng</option>
                    <option>Hỗ trợ đơn hàng</option>
                    <option>Bảo hành / kỹ thuật</option>
                    <option>Đóng góp ý kiến</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label small">Nội dung</label>
                  <textarea
                    rows="4"
                    className="form-control form-control-sm"
                    placeholder="Mô tả vấn đề hoặc góp ý của bạn..."
                  />
                </div>
              </div>
              <button type="button" className="btn btn-primary btn-sm mt-3 w-100">
                Gửi yêu cầu (demo)
              </button>
              <p className="small text-muted mt-2 mb-0">
                Đây là form minh họa giao diện, bạn có thể kết nối API thật sau này để nhận
                dữ liệu từ khách hàng.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
