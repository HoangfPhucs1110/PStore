// src/pages/Guide.jsx
export default function Guide() {
  return (
    <div className="container my-4">
      {/* HEADER */}
      <h2 className="fw-bold mb-2">Hướng dẫn mua hàng</h2>
      <p className="text-muted mb-4">
        Quy trình đặt hàng online tại PStore được tối giản nhưng vẫn đầy đủ thông tin
        cần thiết cho bạn.
      </p>

      {/* STEPS */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="p-3 bg-light rounded-3 h-100">
            <span className="badge bg-primary mb-2">Bước 1</span>
            <h6 className="fw-semibold mb-1">Chọn sản phẩm</h6>
            <p className="small text-muted mb-0">
              Dùng bộ lọc theo hãng, nhu cầu, mức giá; xem chi tiết cấu hình trước khi
              thêm vào giỏ.
            </p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="p-3 bg-light rounded-3 h-100">
            <span className="badge bg-primary mb-2">Bước 2</span>
            <h6 className="fw-semibold mb-1">Kiểm tra giỏ hàng</h6>
            <p className="small text-muted mb-0">
              Điều chỉnh số lượng, xóa sản phẩm không cần, áp mã giảm giá nếu có.
            </p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="p-3 bg-light rounded-3 h-100">
            <span className="badge bg-primary mb-2">Bước 3</span>
            <h6 className="fw-semibold mb-1">Nhập thông tin</h6>
            <p className="small text-muted mb-0">
              Đăng nhập hoặc đăng ký tài khoản, nhập địa chỉ giao hàng, số điện thoại
              liên hệ.
            </p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="p-3 bg-light rounded-3 h-100">
            <span className="badge bg-primary mb-2">Bước 4</span>
            <h6 className="fw-semibold mb-1">Chọn thanh toán</h6>
            <p className="small text-muted mb-0">
              Chọn COD, chuyển khoản, ví điện tử… PStore sẽ xác nhận và tiến hành giao hàng.
            </p>
          </div>
        </div>
      </div>

      {/* TIPS */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="p-3 bg-dark text-light rounded-3 h-100">
            <h6 className="fw-semibold mb-2">Mẹo chọn laptop nhanh</h6>
            <ul className="small mb-0">
              <li>Học tập / văn phòng: CPU i3/i5, RAM 8GB, SSD 256GB trở lên.</li>
              <li>Gaming: CPU i5/i7, RAM 16GB, VGA rời (RTX / GTX), SSD 512GB.</li>
              <li>Đồ họa: màn IPS, độ phủ màu tốt, RAM 16GB, SSD 1TB nếu có điều kiện.</li>
            </ul>
          </div>
        </div>
        <div className="col-md-6">
          <div className="p-3 bg-white rounded-3 shadow-sm h-100">
            <h6 className="fw-semibold mb-2">Mẹo kiểm tra khi nhận hàng</h6>
            <ul className="small text-muted mb-0">
              <li>Quay video khi mở hộp để làm bằng chứng nếu có lỗi vận chuyển.</li>
              <li>Kiểm tra ngoại quan: vỏ máy, màn hình, cổng kết nối.</li>
              <li>
                Khởi động thử máy, kiểm tra số serial khớp với phiếu và trên vỏ hộp.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Q&A NHỎ */}
      <div className="p-3 bg-light rounded-3">
        <h6 className="fw-semibold mb-2">Một số câu hỏi nhanh</h6>
        <ul className="small text-muted mb-0">
          <li className="mb-1">
            <span className="fw-semibold">Có thể nhận máy tại cửa hàng không?</span>
            <br />
            Hoàn toàn được, bạn chọn “nhận tại cửa hàng” ở bước nhập thông tin.
          </li>
          <li>
            <span className="fw-semibold">Ship tỉnh có hỗ trợ kiểm tra không?</span>
            <br />
            Tùy đơn vị vận chuyển, bạn nên quay video khi khui hộp để bảo vệ quyền lợi.
          </li>
        </ul>
      </div>
    </div>
  );
}
