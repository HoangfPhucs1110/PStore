// src/pages/About.jsx
export default function About() {
  return (
    <div className="bg-light">
      {/* HERO */}
      <section className="py-5 border-bottom">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-lg-7">
              <h1 className="fw-bold mb-2">PStore – Power Your Setup</h1>
              <p className="text-muted mb-3">
                Hệ thống bán lẻ laptop, PC, màn hình và gaming gear chính hãng dành cho
                học tập, làm việc và giải trí.
              </p>
              <div className="d-flex flex-wrap gap-2 small mb-3">
                <span className="badge bg-primary">Laptop học tập</span>
                <span className="badge bg-success">PC gaming</span>
                <span className="badge bg-warning text-dark">Màn hình đồ họa</span>
                <span className="badge bg-info text-dark">Gear streaming</span>
              </div>
              <div className="row g-2 small text-muted">
                <div className="col-4">
                  <div className="p-2 bg-white rounded-3 shadow-sm h-100 text-center">
                    <div className="fw-bold fs-5">5+</div>
                    <div>Năm kinh nghiệm</div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-2 bg-white rounded-3 shadow-sm h-100 text-center">
                    <div className="fw-bold fs-5">10k+</div>
                    <div>Khách hàng</div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-2 bg-white rounded-3 shadow-sm h-100 text-center">
                    <div className="fw-bold fs-5">500+</div>
                    <div>Sản phẩm</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="p-4 bg-dark text-light rounded-4 shadow-sm h-100">
                <h5 className="mb-2">Cam kết của PStore</h5>
                <ul className="small mb-3">
                  <li>Sản phẩm chính hãng, bảo hành rõ ràng.</li>
                  <li>Giá tốt, nhiều ưu đãi cho sinh viên.</li>
                  <li>Hỗ trợ build cấu hình theo nhu cầu thực tế.</li>
                </ul>
                <p className="small mb-0">
                  Chúng tôi mong muốn trở thành người bạn đồng hành đáng tin cậy trong mọi
                  hành trình học tập và làm việc của bạn.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GIÁ TRỊ CỐT LÕI */}
      <section className="py-5">
        <div className="container">
          <h4 className="fw-bold mb-4 text-center">Giá trị cốt lõi</h4>
          <div className="row g-3">
            <div className="col-md-4">
              <div className="p-3 bg-white rounded-3 shadow-sm h-100">
                <h6 className="fw-semibold mb-2">Chất lượng</h6>
                <p className="small text-muted mb-0">
                  Làm việc trực tiếp với các hãng lớn: ASUS, MSI, GIGABYTE, Dell...
                  hạn chế tối đa hàng kém chất lượng, hàng “dựng”.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3 bg-white rounded-3 shadow-sm h-100">
                <h6 className="fw-semibold mb-2">Minh bạch</h6>
                <p className="small text-muted mb-0">
                  Thông tin cấu hình, giá bán, ưu đãi được hiển thị rõ ràng, dễ so sánh,
                  không “ẩn phí” hay điều kiện khó hiểu.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3 bg-white rounded-3 shadow-sm h-100">
                <h6 className="fw-semibold mb-2">Đồng hành</h6>
                <p className="small text-muted mb-0">
                  Tư vấn trước khi mua, hỗ trợ cài đặt – vệ sinh – nâng cấp trong suốt
                  quá trình sử dụng, không bỏ rơi khách sau bán.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HÀNH TRÌNH PHÁT TRIỂN */}
      <section className="py-5 border-top">
        <div className="container">
          <h4 className="fw-bold mb-4 text-center">Hành trình phát triển</h4>
          <div className="row g-3 small text-muted">
            <div className="col-md-3">
              <div className="p-3 bg-white rounded-3 shadow-sm h-100">
                <div className="fw-bold mb-1">2019</div>
                <p className="mb-0">
                  PStore bắt đầu từ một cửa hàng nhỏ chuyên laptop sinh viên và
                  linh kiện cơ bản.
                </p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-3 bg-white rounded-3 shadow-sm h-100">
                <div className="fw-bold mb-1">2021</div>
                <p className="mb-0">
                  Mở rộng sang PC gaming, màn hình đồ họa và trang bị khu trải nghiệm
                  trực tiếp.
                </p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-3 bg-white rounded-3 shadow-sm h-100">
                <div className="fw-bold mb-1">2023</div>
                <p className="mb-0">
                  Ra mắt hệ thống bán hàng online, tối ưu giao diện cho người dùng
                  trên mọi thiết bị.
                </p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-3 bg-white rounded-3 shadow-sm h-100">
                <div className="fw-bold mb-1">Hiện tại</div>
                <p className="mb-0">
                  Tiếp tục nâng cấp dịch vụ, đa dạng sản phẩm cho cả người dùng phổ
                  thông lẫn creator / streamer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
