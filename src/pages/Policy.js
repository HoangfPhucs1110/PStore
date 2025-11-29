// src/pages/Policy.jsx
export default function Policy() {
  return (
    <div className="container my-4">
      {/* HEADER */}
      <div className="mb-4">
        <h2 className="fw-bold mb-2">Chính sách & bảo hành</h2>
        <p className="text-muted mb-0">
          PStore thiết kế chính sách rõ ràng để bạn luôn nắm được quyền lợi của mình
          khi mua sắm.
        </p>
      </div>

      <div className="row g-4">
        {/* NỘI DUNG CHÍNH */}
        <div className="col-lg-8">
          <div className="mb-3 p-3 border rounded-3">
            <h6 className="fw-semibold mb-2">1. Đổi trả sản phẩm</h6>
            <ul className="small text-muted mb-0">
              <li>Đổi mới trong 7 ngày nếu lỗi phần cứng do nhà sản xuất.</li>
              <li>
                Máy chưa kích hoạt / chưa đăng nhập tài khoản cá nhân có thể hỗ trợ
                đổi cấu hình khác (có bù chênh lệch).
              </li>
              <li>Không áp dụng đổi trả với lỗi do va đập, rơi vỡ, vào nước...</li>
            </ul>
          </div>

          <div className="mb-3 p-3 border rounded-3">
            <h6 className="fw-semibold mb-2">2. Bảo hành</h6>
            <ul className="small text-muted mb-0">
              <li>Bảo hành theo tiêu chuẩn từng hãng, có phiếu và hóa đơn đi kèm.</li>
              <li>
                Tiếp nhận bảo hành tại PStore, hỗ trợ gửi hãng và thông báo khi hoàn tất.
              </li>
              <li>
                Khách hàng có thể tra cứu thông tin bảo hành qua hotline hoặc email.
              </li>
            </ul>
          </div>

          <div className="mb-3 p-3 border rounded-3">
            <h6 className="fw-semibold mb-2">3. Vận chuyển</h6>
            <ul className="small text-muted mb-0">
              <li>Đóng gói chống sốc, bọc xốp, thùng carton cứng.</li>
              <li>
                Hỗ trợ kiểm tra ngoại quan máy khi nhận hàng, mở hộp có quay video để
                bảo vệ quyền lợi.
              </li>
              <li>
                Miễn phí / giảm phí ship cho đơn đạt mức giá quy định hoặc trong các
                dịp khuyến mãi.
              </li>
            </ul>
          </div>

          <div className="mb-3 p-3 border rounded-3">
            <h6 className="fw-semibold mb-2">4. Bảo mật thông tin</h6>
            <ul className="small text-muted mb-0">
              <li>
                Thông tin khách hàng chỉ dùng cho mục đích giao dịch và chăm sóc sau bán.
              </li>
              <li>Không chia sẻ cho bên thứ ba nếu không có sự đồng ý của khách.</li>
            </ul>
          </div>
        </div>

        {/* SIDEBAR + FAQ */}
        <div className="col-lg-4">
          <div className="p-3 bg-light rounded-3 mb-3">
            <h6 className="fw-semibold mb-2">Hỗ trợ nhanh</h6>
            <p className="small text-muted mb-1">
              Nếu bạn chưa rõ về điều khoản, hãy liên hệ trực tiếp:
            </p>
            <p className="small mb-1">Hotline: 1900.5301</p>
            <p className="small mb-3">Email: cs@pstore.vn</p>
            <p className="small text-muted mb-0">
              Nhân viên PStore luôn cố gắng giải thích dễ hiểu, tránh dùng ngôn ngữ
              “luật” phức tạp.
            </p>
          </div>

          <div className="p-3 bg-white rounded-3 shadow-sm">
            <h6 className="fw-semibold mb-2">Câu hỏi thường gặp</h6>
            <ul className="small text-muted mb-0">
              <li className="mb-1">
                <span className="fw-semibold">Mất hóa đơn có bảo hành được không?</span>
                <br />
                Vẫn hỗ trợ nếu tra được thông tin mua hàng theo số điện thoại / email.
              </li>
              <li className="mb-1">
                <span className="fw-semibold">
                  Khi gửi bảo hành có được mượn máy không?
                </span>
                <br />
                Tùy chương trình hỗ trợ, bạn có thể hỏi thêm khi gửi máy.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
