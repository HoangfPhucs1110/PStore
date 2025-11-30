import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { FiTrash2, FiShoppingCart } from "react-icons/fi";

export default function Wishlist() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const nav = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const load = async () => {
      try {
        const res = await api.get("/wishlists");
        const ids = res.data?.productIds || [];
        if (ids.length === 0) {
          setItems([]);
          return;
        }
        const detail = await Promise.all(
          ids.map((id) => api.get(`/products/${id}`))
        );
        setItems(detail.map((r) => r.data));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const removeItem = async (p) => {
    try {
      await api.post("/wishlists/toggle", { productId: p._id });
      setItems((prev) => prev.filter((x) => x._id !== p._id));
    } catch (err) {
      console.error(err);
    }
  };

  const moveToCart = (p) => {
    addToCart(p, 1);
    nav("/cart");
  };

  if (!user)
    return (
      <div className="home-section-bg py-4">
        <div className="container">
          <h4 className="mb-3">Danh sách yêu thích</h4>
          <div className="bg-white rounded-3 shadow-sm p-4 text-center">
            <p className="mb-3">Vui lòng đăng nhập để xem danh sách yêu thích.</p>
            <Link to="/login" className="btn btn-primary">
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    );

  if (loading)
    return (
      <div className="home-section-bg py-4">
        <div className="container">
          <h4 className="mb-3">Danh sách yêu thích</h4>
          <div className="bg-white rounded-3 shadow-sm p-4 text-center">
            Đang tải...
          </div>
        </div>
      </div>
    );

  if (items.length === 0)
    return (
      <div className="home-section-bg py-4">
        <div className="container">
          <h4 className="mb-3">Danh sách yêu thích</h4>
          <div className="bg-white rounded-3 shadow-sm p-4 text-center">
            <p className="mb-3">
              Chưa có sản phẩm nào trong danh sách yêu thích.
            </p>
            <Link to="/products" className="btn btn-primary">
              Khám phá sản phẩm
            </Link>
          </div>
        </div>
      </div>
    );

  return (
    <div className="home-section-bg py-4">
      <div className="container">
        <h4 className="mb-3">Danh sách yêu thích</h4>
        <div className="bg-white rounded-3 shadow-sm p-3">
          <div className="row g-3">
            {items.map((p) => (
              <div key={p._id} className="col-12 col-md-6 col-lg-4">
                <div className="border rounded-3 p-3 h-100 d-flex flex-column">
                  <div className="d-flex gap-3">
                    <div
                      className="rounded bg-light flex-shrink-0 d-flex align-items-center justify-content-center"
                      style={{ width: 90, height: 90, overflow: "hidden" }}
                    >
                      <img
                        src={p.thumbnail || p.images?.[0]}
                        alt={p.name}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "cover"
                        }}
                      />
                    </div>
                    <div className="flex-grow-1">
                      <Link
                        to={`/products/${p.slug}`}
                        className="text-decoration-none text-dark"
                      >
                        <div className="fw-semibold mb-1">{p.name}</div>
                      </Link>
                      <div className="small text-muted mb-1">{p.brand}</div>
                      <div className="fw-semibold text-primary">
                        {p.price.toLocaleString("vi-VN")} đ
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 d-flex justify-content-between gap-2">
                    <button
                      className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                      onClick={() => removeItem(p)}
                    >
                      <FiTrash2 /> Xóa
                    </button>
                    <button
                      className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                      onClick={() => moveToCart(p)}
                    >
                      <FiShoppingCart /> Thêm vào giỏ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
