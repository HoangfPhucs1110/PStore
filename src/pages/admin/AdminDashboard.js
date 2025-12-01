import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { orderService } from "../../services/orderService";
import { productService } from "../../services/productService";
import { userService } from "../../services/userService";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { FiShoppingBag, FiUsers, FiPackage, FiDollarSign } from "react-icons/fi";
// Import Recharts
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ orders: 0, products: 0, users: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const ordersData = await orderService.getAll().catch(() => []);
        const productsData = await productService.getAll({ limit: 1 }).catch(() => ({ total: 0 }));
        const usersData = await userService.getAll().catch(() => []);

        // Tính tổng lợi nhuận toàn thời gian
        const profit = ordersData
          .filter(o => o.status === 'completed')
          .reduce((s, o) => s + (o.totalProfit || 0), 0);
          
        setStats({
            orders: ordersData.length,
            products: productsData.total || 0,
            users: usersData.length,
            revenue: profit
        });

        // --- Xử lý dữ liệu biểu đồ (7 ngày gần nhất) ---
        const dailyData = {};
        ordersData.forEach(order => {
            if (order.status === 'completed') {
                const date = new Date(order.createdAt).toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit'});
                if (!dailyData[date]) dailyData[date] = { date, DoanhThu: 0, LoiNhuan: 0 };
                dailyData[date].DoanhThu += order.total;
                dailyData[date].LoiNhuan += (order.totalProfit || 0);
            }
        });
        
        // Sắp xếp theo thời gian và lấy 7 ngày
        const chartArray = Object.values(dailyData).reverse().slice(0, 7).reverse();
        setChartData(chartArray);

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
        
        <div className="row g-3 mb-4">
          <StatCard title="Đơn hàng" value={stats.orders} color="primary" icon={<FiShoppingBag/>} />
          <StatCard title="Lợi nhuận ròng" value={stats.revenue.toLocaleString() + 'đ'} color="success" icon={<FiDollarSign/>} />
          <StatCard title="Sản phẩm" value={stats.products} color="warning" icon={<FiPackage/>} />
          <StatCard title="Người dùng" value={stats.users} color="info" icon={<FiUsers/>} />
        </div>

        {/* --- BIỂU ĐỒ --- */}
        <div className="row mb-4">
            <div className="col-md-7">
                <div className="card border-0 shadow-sm p-4 h-100">
                    <h6 className="fw-bold mb-3 text-secondary">Biểu đồ Lợi nhuận & Doanh thu</h6>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip formatter={(value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)}/>
                                <Legend />
                                <Bar dataKey="DoanhThu" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="LoiNhuan" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            <div className="col-md-5">
                 <div className="card border-0 shadow-sm p-4 h-100">
                    <h6 className="fw-bold mb-3 text-secondary">Xu hướng Lợi nhuận</h6>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip formatter={(value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)}/>
                                <Line type="monotone" dataKey="LoiNhuan" stroke="#10b981" strokeWidth={3} dot={{r: 4}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                 </div>
            </div>
        </div>

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