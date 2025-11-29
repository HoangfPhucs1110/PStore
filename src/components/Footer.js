import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-dark text-light pt-4 mt-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <h5 className="fw-bold mb-2">PStore</h5>
            <p className="small mb-2">
              Laptop, PC, gaming gear chính hãng, giá tốt cho học tập, làm việc và giải trí.
            </p>
            <p className="small mb-1">Hotline: <a href="tel:19005301" className="text-info text-decoration-none">1900.5301</a></p>
            <p className="small mb-0">Email: <a href="mailto:cs@pstore.vn" className="text-info text-decoration-none">cs@pstore.vn</a></p>
          </div>

          <div className="col-md-4">
            <h6 className="fw-semibold mb-3">Hỗ trợ khách hàng</h6>
            <ul className="list-unstyled small mb-0">
              <li><Link to="/about" className="text-decoration-none text-light">Giới thiệu PStore</Link></li>
              <li><Link to="/policy" className="text-decoration-none text-light">Chính sách & bảo hành</Link></li>
              <li><Link to="/guide" className="text-decoration-none text-light">Hướng dẫn mua hàng</Link></li>
              <li><Link to="/contact" className="text-decoration-none text-light">Liên hệ / Góp ý</Link></li>
            </ul>
          </div>

          <div className="col-md-4">
            <h6 className="fw-semibold mb-3">Kết nối & thanh toán</h6>
            <div className="d-flex gap-2 mb-3">
              <a href="#" className="btn btn-outline-light btn-sm rounded-circle px-2">f</a>
              <a href="#" className="btn btn-outline-light btn-sm rounded-circle px-2">▶</a>
              <a href="#" className="btn btn-outline-light btn-sm rounded-circle px-2">Z</a>
            </div>
            <div className="small mb-1">Chấp nhận thanh toán:</div>
            <div className="d-flex flex-wrap gap-2 small">
              <span className="badge bg-light text-dark">VISA</span>
              <span className="badge bg-light text-dark">MasterCard</span>
              <span className="badge bg-light text-dark">Momo</span>
              <span className="badge bg-light text-dark">ZaloPay</span>
            </div>
          </div>
        </div>

        <hr className="border-secondary mt-4" />
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center small text-secondary pb-2">
          <span>© 2025 PStore. All rights reserved.</span>
          <span className="mt-2 mt-md-0">Giao hàng bởi GHN, GHTK, J&T,…</span>
        </div>
      </div>
    </footer>
  );
}