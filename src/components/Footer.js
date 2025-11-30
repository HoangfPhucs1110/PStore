import { FiFacebook, FiYoutube, FiInstagram } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-dark text-light mt-auto">
      <div className="container py-4">
        <div className="row g-4">
          <div className="col-md-4">
            <h5 className="fw-bold">PStore</h5>
            <p className="small mb-1">
              Laptop, PC, gaming gear chính hãng, giá tốt cho học tập, làm việc
              và giải trí.
            </p>
            <p className="small mb-1">
              Hotline: <a href="tel:19005301" className="text-info">1900.5301</a>
            </p>
            <p className="small mb-0">
              Email:{" "}
              <a href="mailto:cs@pstore.vn" className="text-info">
                cs@pstore.vn
              </a>
            </p>
          </div>

          <div className="col-md-4">
            <h6 className="fw-semibold">Hỗ trợ khách hàng</h6>
            <ul className="list-unstyled small mb-0">
              <li>
                <a href="/about" className="text-light text-decoration-none">
                  Giới thiệu PStore
                </a>
              </li>
              <li>
                <a href="/policy" className="text-light text-decoration-none">
                  Chính sách &amp; bảo hành
                </a>
              </li>
              <li>
                <a href="/guide" className="text-light text-decoration-none">
                  Hướng dẫn mua hàng
                </a>
              </li>
              <li>
                <a href="/contact" className="text-light text-decoration-none">
                  Liên hệ / Góp ý
                </a>
              </li>
            </ul>
          </div>

          <div className="col-md-4">
            <h6 className="fw-semibold">Kết nối &amp; thanh toán</h6>
            <div className="d-flex align-items-center gap-3 mb-3">
              <a href="#" className="text-light">
                <FiFacebook size={22} />
              </a>
              <a href="#" className="text-light">
                <FiYoutube size={22} />
              </a>
              <a href="#" className="text-light">
                <FiInstagram size={22} />
              </a>
            </div>
            <div className="small">
              <div className="mb-1">Chấp nhận thanh toán:</div>
              <div className="d-flex flex-wrap gap-2">
                <span className="badge bg-light text-dark">VISA</span>
                <span className="badge bg-light text-dark">MasterCard</span>
                <span className="badge bg-light text-dark">Momo</span>
                <span className="badge bg-light text-dark">ZaloPay</span>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-secondary my-3" />
        <div className="d-flex flex-column flex-md-row justify-content-between small text-secondary">
          <span>© 2025 PStore. All rights reserved.</span>
          <span>Giao hàng bởi GHN, GHTK, J&amp;T,…</span>
        </div>
      </div>
    </footer>
  );
}