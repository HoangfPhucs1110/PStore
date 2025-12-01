import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import { productService } from "../../services/productService";
import ProductCard from "../../components/product/ProductCard";
import { useAuth } from "../../context/AuthContext";
import { FiHeart } from "react-icons/fi";

export default function Wishlist() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load danh sách
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadWishlist = async () => {
      try {
        setLoading(true);
        // 1. Lấy danh sách ID từ Wishlist của User
        const res = await api.get("/wishlists");
        const ids = res.data.productIds || [];

        if (ids.length > 0) {
          // 2. Lấy chi tiết từng sản phẩm dựa trên ID
          // Sử dụng Promise.allSettled để nếu 1 sản phẩm lỗi (đã bị xóa khỏi DB) thì không làm chết cả trang
          const promises = ids.map((id) => productService.getById(id).catch(() => null));
          const results = await Promise.all(promises);
          
          // 3. Lọc bỏ những sản phẩm null (do lỗi hoặc đã bị xóa)
          const validProducts = results.filter((p) => p && p._id);
          setProducts(validProducts);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Lỗi tải wishlist:", err);
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, [user]);

  // Xóa khỏi wishlist ngay tại trang này
  const handleRemove = async (productId) => {
    try {
        await api.post("/wishlists/toggle", { productId });
        // Cập nhật giao diện ngay lập tức
        setProducts(prev => prev.filter(p => p._id !== productId));
    } catch (err) {
        alert("Lỗi khi xóa");
    }
  };

  if (!user) return (
    <div className="container py-5 text-center bg-white rounded shadow-sm my-4">
        <h4 className="mb-3">Bạn chưa đăng nhập</h4>
        <p className="text-muted mb-4">Vui lòng đăng nhập để xem danh sách yêu thích của bạn.</p>
        <Link to="/login" className="btn btn-primary px-4">Đăng nhập ngay</Link>
    </div>
  );

  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container">
        <div className="d-flex align-items-center gap-2 mb-4 pb-2 border-bottom">
            <FiHeart className="text-danger" size={24} />
            <h4 className="fw-bold mb-0">Sản phẩm đã thích ({products.length})</h4>
        </div>
        
        {loading ? (
          <div className="text-center py-5">
             <div className="spinner-border text-primary" role="status"></div>
             <p className="mt-2 text-muted">Đang tải danh sách...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-5 bg-white rounded shadow-sm">
              <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-2130356-1800917.png" alt="Empty" width="200" />
              <h5 className="mt-3">Danh sách trống</h5>
              <p className="text-muted">Bạn chưa yêu thích sản phẩm nào.</p>
              <Link to="/products" className="btn btn-primary mt-2">Khám phá sản phẩm</Link>
          </div>
        ) : (
          <div className="row g-3">
            {products.map((p) => (
              <div key={p._id} className="col-6 col-md-4 col-lg-3 position-relative">
                <ProductCard product={p} />
                {/* Nút xóa nhanh */}
                <button 
                    className="btn btn-sm btn-light text-danger position-absolute shadow-sm"
                    style={{top: 10, right: 20, zIndex: 10, borderRadius: '50%', width: 30, height: 30, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                    onClick={(e) => {
                        e.preventDefault();
                        handleRemove(p._id);
                    }}
                    title="Bỏ thích"
                >
                    ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}