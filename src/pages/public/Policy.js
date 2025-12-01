import React from "react";
import { FiShield, FiRefreshCw, FiCheck, FiX, FiAlertCircle } from "react-icons/fi";

export default function Policy() {
  return (
    <div className="bg-light min-vh-100 font-sans pb-5">
      {/* HEADER */}
      <div className="bg-white py-5 border-bottom mb-5">
        <div className="container text-center">
          <h1 className="fw-bold display-6 text-dark mb-3">Chính sách & Quy định</h1>
          <p className="text-muted fs-5 mx-auto" style={{maxWidth: "700px"}}>
            Cam kết bảo vệ quyền lợi khách hàng với chế độ hậu mãi minh bạch và tận tâm.
          </p>
        </div>
      </div>

      <div className="container">
        <div className="row g-5">
          {/* CỘT TRÁI: BẢO HÀNH */}
          <div className="col-lg-6">
            <div className="bg-white p-4 p-lg-5 rounded-4 shadow-sm h-100 position-relative overflow-hidden">
              <div className="position-absolute top-0 end-0 p-3 opacity-10">
                <FiShield size={120} className="text-primary" />
              </div>
              
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle">
                  <FiShield size={28} />
                </div>
                <h3 className="fw-bold m-0 text-dark">Chính sách bảo hành</h3>
              </div>

              <p className="text-secondary mb-4">
                Tất cả sản phẩm tại PStore là hàng chính hãng 100%, được bảo hành điện tử hoặc theo tem phiếu của nhà sản xuất.
              </p>

              <div className="mb-4">
                <h6 className="fw-bold text-success mb-3 d-flex align-items-center gap-2">
                  <FiCheck /> Điều kiện tiếp nhận
                </h6>
                <ul className="list-unstyled d-flex flex-column gap-2 text-secondary small">
                  <li className="d-flex gap-2"><div className="mt-1 bg-light rounded-circle p-1"><div className="bg-success rounded-circle" style={{width: 6, height: 6}}></div></div> Sản phẩm còn trong thời hạn bảo hành.</li>
                  <li className="d-flex gap-2"><div className="mt-1 bg-light rounded-circle p-1"><div className="bg-success rounded-circle" style={{width: 6, height: 6}}></div></div> Lỗi kỹ thuật được xác định do Nhà sản xuất.</li>
                  <li className="d-flex gap-2"><div className="mt-1 bg-light rounded-circle p-1"><div className="bg-success rounded-circle" style={{width: 6, height: 6}}></div></div> Tem bảo hành, số Serial/IMEI còn nguyên vẹn.</li>
                </ul>
              </div>

              <div>
                <h6 className="fw-bold text-danger mb-3 d-flex align-items-center gap-2">
                  <FiX /> Từ chối bảo hành
                </h6>
                <ul className="list-unstyled d-flex flex-column gap-2 text-secondary small">
                  <li className="d-flex gap-2"><div className="mt-1 bg-light rounded-circle p-1"><div className="bg-danger rounded-circle" style={{width: 6, height: 6}}></div></div> Sản phẩm bị tác động vật lý (rơi, vỡ, vào nước).</li>
                  <li className="d-flex gap-2"><div className="mt-1 bg-light rounded-circle p-1"><div className="bg-danger rounded-circle" style={{width: 6, height: 6}}></div></div> Đã bị can thiệp, sửa chữa bởi bên thứ 3.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: ĐỔI TRẢ */}
          <div className="col-lg-6">
            <div className="bg-white p-4 p-lg-5 rounded-4 shadow-sm h-100 position-relative overflow-hidden">
              <div className="position-absolute top-0 end-0 p-3 opacity-10">
                <FiRefreshCw size={120} className="text-warning" />
              </div>

              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="bg-warning bg-opacity-10 text-warning p-3 rounded-circle">
                  <FiRefreshCw size={28} />
                </div>
                <h3 className="fw-bold m-0 text-dark">Chính sách đổi trả</h3>
              </div>

              <p className="text-secondary mb-4">
                Hỗ trợ đổi mới trong 30 ngày đầu tiên. An tâm tuyệt đối khi mua sắm.
              </p>

              <div className="row g-3">
                <div className="col-12">
                  <div className="p-3 border rounded-3 bg-light d-flex gap-3">
                    <FiCheck className="text-success mt-1 flex-shrink-0" size={20}/>
                    <div>
                      <h6 className="fw-bold text-dark">Lỗi do Nhà sản xuất</h6>
                      <p className="mb-0 small text-secondary">Đổi mới 100% miễn phí trong 30 ngày. Hoàn tiền nếu hết hàng.</p>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="p-3 border rounded-3 bg-light d-flex gap-3">
                    <FiAlertCircle className="text-warning mt-1 flex-shrink-0" size={20}/>
                    <div>
                      <h6 className="fw-bold text-dark">Đổi trả theo nhu cầu</h6>
                      <p className="mb-0 small text-secondary">Thu phí 10% - 20% giá trị sản phẩm. Yêu cầu còn nguyên seal, chưa kích hoạt.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* FOOTER NOTE */}
        <div className="text-center mt-5 text-muted small">
          <p className="mb-0">Mọi thắc mắc về chính sách, vui lòng liên hệ Hotline <strong className="text-dark">1900.5301</strong> để được giải đáp.</p>
        </div>
      </div>
    </div>
  );
}