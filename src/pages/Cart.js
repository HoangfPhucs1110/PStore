import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, updateQty, removeFromCart } = useCart();
  const nav = useNavigate();

  const total = cart.reduce((s, x) => s + x.price * x.qty, 0);

  if (cart.length === 0)
    return (
      <div className="container my-4">
        <h5>Giỏ hàng</h5>
        <p className="text-muted">Giỏ hàng của bạn đang trống.</p>
        <Link to="/products" className="btn btn-primary">
          Mua hàng ngay
        </Link>
      </div>
    );

  return (
    <div className="container my-4">
      <h5 className="mb-3">Giỏ hàng</h5>
      <div className="row g-3">
        <div className="col-lg-8">
          <div className="bg-white rounded-3 shadow-sm p-3">
            {cart.map((item) => {
              const img = item.image || "/images/placeholder.png";

              return (
                <div
                  key={item._id}
                  className="d-flex align-items-center border-bottom py-2"
                >
                  <img
                    src={img}
                    alt={item.name}
                    style={{ width: 72, height: 72, objectFit: "cover" }}
                    className="me-3 rounded border"
                  />
                  <div className="flex-grow-1">
                    <Link
                      to={`/products/${item.slug}`}
                      className="text-decoration-none text-dark"
                    >
                      <div className="fw-semibold">{item.name}</div>
                    </Link>
                    <div className="text-danger fw-semibold">
                      {item.price.toLocaleString()} đ
                    </div>
                  </div>
                  <div className="d-flex align-items-center me-3">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() =>
                        updateQty(item._id, Math.max(1, item.qty - 1))
                      }
                    >
                      -
                    </button>
                    <span className="px-2">{item.qty}</span>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => updateQty(item._id, item.qty + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="btn btn-sm btn-link text-danger"
                    onClick={() => removeFromCart(item._id)}
                  >
                    Xóa
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="col-lg-4">
          <div className="bg-white rounded-3 shadow-sm p-3">
            <h6 className="mb-3">Tóm tắt đơn hàng</h6>
            <div className="d-flex justify-content-between mb-2">
              <span>Tạm tính</span>
              <span>{total.toLocaleString()} đ</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Phí vận chuyển</span>
              <span>Miễn phí</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between mb-3 fw-semibold">
              <span>Tổng cộng</span>
              <span className="text-danger">{total.toLocaleString()} đ</span>
            </div>
            <button
              className="btn btn-primary w-100"
              onClick={() => nav("/checkout")}
            >
              Đặt hàng
            </button>
            <Link to="/products" className="btn btn-link w-100 mt-1">
              Mua thêm sản phẩm khác
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
