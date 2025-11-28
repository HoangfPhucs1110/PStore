import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="container mt-3">
      <div className="bg-white rounded-3 shadow-sm p-3">
        <h4 className="mb-3">Trang quản trị PStore</h4>
        <div className="row g-3">
          <div className="col-md-4">
            <Link to="/admin/products" className="text-decoration-none">
              <div className="p-3 border rounded-3 h-100 hover-shadow-sm">
                <h6>Quản lý sản phẩm</h6>
                <p className="small text-muted mb-0">
                  Thêm, sửa, xóa sản phẩm, chỉnh giá, kho hàng.
                </p>
              </div>
            </Link>
          </div>
          <div className="col-md-4">
            <Link to="/admin/orders" className="text-decoration-none">
              <div className="p-3 border rounded-3 h-100 hover-shadow-sm">
                <h6>Quản lý đơn hàng</h6>
                <p className="small text-muted mb-0">
                  Xem và cập nhật trạng thái đơn hàng.
                </p>
              </div>
            </Link>
            
          </div>
        </div>
      </div>
    </div>
  );
}
