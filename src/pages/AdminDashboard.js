import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenueToday: 0,
    reviews: 0
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [p, o, u, r] = await Promise.all([
          api.get("/products"),
          api.get("/orders"),
          api.get("/admin/users"),
          api.get("/admin/reviews")
        ]);

        const today = new Date().toISOString().slice(0, 10);
        const revenueToday = (o.data || [])
          .filter(
            (x) =>
              x.status === "completed" &&
              x.createdAt?.slice(0, 10) === today
          )
          .reduce((s, x) => s + (x.total || x.totalPrice || 0), 0);

        setStats({
          products: (p.data || []).length,
          orders: (o.data || []).length,
          users: (u.data || []).length,
          revenueToday,
          reviews: (r.data || []).length
        });
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  const cards = [
    {
      title: "Sản phẩm",
      value: stats.products,
      desc: "Tổng số sản phẩm đang bán",
      link: "/admin/products",
      linkText: "Quản lý sản phẩm"
    },
    {
      title: "Đơn hàng",
      value: stats.orders,
      desc: "Tất cả đơn hàng trên hệ thống",
      link: "/admin/orders",
      linkText: "Quản lý đơn hàng"
    },
    {
      title: "Người dùng",
      value: stats.users,
      desc: "Tài khoản đã đăng ký",
      link: "/admin/users",
      linkText: "Quản lý người dùng"
    },
    {
      title: "Đánh giá",
      value: stats.reviews,
      desc: "Tổng số đánh giá sản phẩm",
      link: "/admin/reviews",
      linkText: "Quản lý đánh giá"
    },
    {
      title: "Doanh thu hôm nay",
      value: stats.revenueToday.toLocaleString("vi-VN") + " đ",
      desc: "Đơn đã hoàn thành trong hôm nay",
      link: "/admin/orders",
      linkText: "Xem chi tiết"
    }
  ];

  return (
    <div className="container my-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="mb-1">Trang quản trị PStore</h4>
          <div className="text-muted small">
            Tổng quan nhanh tình trạng cửa hàng.
          </div>
        </div>
      </div>

      {/* Thống kê nhanh */}
      <div className="row g-3 mb-4">
        {cards.map((c, idx) => (
          <div className="col-12 col-md-6 col-xl-3" key={idx}>
            <div className="bg-white rounded-3 shadow-sm p-3 h-100 d-flex flex-column">
              <div className="small text-muted mb-1">{c.title}</div>
              <div className="fs-4 fw-semibold mb-1">{c.value}</div>
              <div className="small text-muted mb-3 flex-grow-1">
                {c.desc}
              </div>
              <Link to={c.link} className="small text-primary">
                {c.linkText} →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Khu vực truy cập nhanh */}
      <div className="row g-3">
        <div className="col-12 col-lg-8">
          <div className="bg-white rounded-3 shadow-sm p-3">
            <h6 className="mb-3">Thao tác nhanh</h6>
            <div className="row g-3">
              <div className="col-md-3">
                <Link
                  to="/admin/products/new"
                  className="text-decoration-none"
                >
                  <div className="p-3 border rounded-3 h-100 hover-shadow-sm">
                    <div className="fw-semibold mb-1">
                      + Thêm sản phẩm mới
                    </div>
                    <div className="small text-muted">
                      Tạo nhanh sản phẩm và cấu hình giá bán.
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-3">
                <Link
                  to="/admin/orders"
                  className="text-decoration-none"
                >
                  <div className="p-3 border rounded-3 h-100 hover-shadow-sm">
                    <div className="fw-semibold mb-1">
                      Xử lý đơn chờ xác nhận
                    </div>
                    <div className="small text-muted">
                      Cập nhật trạng thái giao hàng.
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-3">
                <Link
                  to="/admin/users"
                  className="text-decoration-none"
                >
                  <div className="p-3 border rounded-3 h-100 hover-shadow-sm">
                    <div className="fw-semibold mb-1">
                      Quản lý tài khoản
                    </div>
                    <div className="small text-muted">
                      Xem danh sách, phân quyền user.
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-3">
                <Link
                  to="/admin/reviews"
                  className="text-decoration-none"
                >
                  <div className="p-3 border rounded-3 h-100 hover-shadow-sm">
                    <div className="fw-semibold mb-1">
                      Quản lý đánh giá
                    </div>
                    <div className="small text-muted">
                      Duyệt, ẩn hoặc xóa đánh giá xấu.
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Ghi chú / hướng dẫn */}
        <div className="col-12 col-lg-4">
          <div className="bg-white rounded-3 shadow-sm p-3 h-100">
            <h6 className="mb-2">Gợi ý quản trị</h6>
            <ul className="small text-muted mb-0 ps-3">
              <li>Kiểm tra đơn hàng mới mỗi ngày.</li>
              <li>Cập nhật tồn kho sau khi nhập hàng.</li>
              <li>Gắn cờ sản phẩm nổi bật để đẩy lên trang chủ.</li>
              <li>Thường xuyên sao lưu dữ liệu database.</li>
              <li>Theo dõi đánh giá xấu để xử lý kịp thời.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
