import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { orderService } from "../../services/orderService";
import { productService } from "../../services/productService";
import { userService } from "../../services/userService";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { FiShoppingBag, FiUsers, FiPackage, FiDollarSign } from "react-icons/fi";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ orders: 0, products: 0, users: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Gọi từng cái để tránh lỗi 1 cái làm chết cả đám
        const ordersData = await orderService.getAll().catch(() => []);
        const productsData = await productService.getAll({ limit: 1 }).catch(() => ({ total: 0 }));
        const usersData = await userService.getAll().catch(() => []);

        const revenue = ordersData
            .filter(o => o.status === 'completed')
            .reduce((s, o) => s + (o.total || 0), 0);
          
        setStats({
            orders: ordersData.length,
            products: productsData.total || 0,
            users: usersData.length,
            revenue
        });

        setRecentOrders(ordersData.slice(0, 5));
      } catch (err) {
        console.error("Dashboard Error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const StatCard = ({ title, value, color, icon }) => (
    <div className="col-md-3">
      <div className={`card border-0 shadow-sm text-white h-100 bg-${color} bg-gradient`}>
        <div className="card-body d-flex align-items-center justify-content-between">
          <div>
            <h6 className="opacity-75 mb-2">{title}</h6>
            <h3 className="fw-bold mb-0">{value}</h3>
          </div>
          <div className="bg-white bg-opacity-25 rounded-circle p-3 fs-4 d-flex align-items-center justify-content-center" style={{width: 60, height: 60}}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="d-flex bg-light min-vh-100">
      <AdminSidebar />
      
      <div className="flex-grow-1 p-4">
        <h4 className="fw-bold mb-4 text-dark">Tổng quan hệ thống</h4>
        
        {/* Thống kê */}
        <div className="row g-3 mb-4">
          <StatCard title="Đơn hàng" value={stats.orders} color="primary" icon={<FiShoppingBag/>} />
          <StatCard title="Doanh thu" value={stats.revenue.toLocaleString() + 'đ'} color="success" icon={<FiDollarSign/>} />
          <StatCard title="Sản phẩm" value={stats.products} color="warning" icon={<FiPackage/>} />
          <StatCard title="Người dùng" value={stats.users} color="info" icon={<FiUsers/>} />
        </div>

        {/* Đơn hàng mới */}
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center">
            <h6 className="fw-bold m-0 text-primary">Đơn hàng mới nhất</h6>
            <Link to="/admin/orders" className="btn btn-sm btn-light text-primary fw-medium">Xem tất cả</Link>
          </div>
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Ngày đặt</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                    <tr><td colSpan="5" className="text-center py-4">Đang tải dữ liệu...</td></tr>
                ) : recentOrders.length === 0 ? (
                    <tr><td colSpan="5" className="text-center py-4 text-muted">Chưa có đơn hàng nào</td></tr>
                ) : recentOrders.map(order => (
                  <tr key={order._id}>
                    <td className="ps-4 fw-medium text-primary">#{order.code || order._id.slice(-6).toUpperCase()}</td>
                    <td>
                        <div className="fw-medium">{order.shippingInfo?.fullName || "Khách lẻ"}</div>
                        <small className="text-muted">{order.shippingInfo?.phone}</small>
                    </td>
                    <td className="fw-bold text-danger">{order.total?.toLocaleString()}đ</td>
                    <td>
                      <span className={`badge rounded-pill ${
                        order.status === 'completed' ? 'bg-success' :
                        order.status === 'canceled' ? 'bg-secondary' :
                        order.status === 'shipping' ? 'bg-info' : 'bg-warning text-dark'
                      }`}>
                        {order.status === 'pending' ? 'Chờ xử lý' : order.status}
                      </span>
                    </td>
                    <td className="text-muted small">
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}