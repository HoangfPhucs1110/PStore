import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const {
    cart,
    updateQty,
    removeFromCart,
    itemsPrice,
    shippingPrice,
    totalPrice
  } = useCart();
  const nav = useNavigate();

  if (!cart || cart.length === 0)
    return (
      <div className="home-section-bg py-4">
        <div className="container">
          <h4 className="mb-3">Giỏ hàng của bạn</h4>
          <div className="bg-white rounded-3 shadow-sm p-4 text-center">
            <p className="mb-3">Giỏ hàng đang trống.</p>
            <Link to="/products" className="btn btn-primary">
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    );

  return (
    <div className="home-section-bg py-4">
      <div className="container">
        <h4 className="mb-3">Giỏ hàng của bạn</h4>
        <div className="row g-3">
          <div className="col-12 col-lg-8">
            <div className="bg-white rounded-3 shadow-sm p-3">
              {cart.map((item) => {
                const img = item.image || "/images/placeholder.png";
                return (
                  <div
                    key={item._id}
                    className="d-flex flex-wrap align-items-center py-3 border-bottom gap-3"
                  >
                    <div
                      className="rounded bg-light flex-shrink-0 d-flex align-items-center justify-content-center border"
                      style={{ width: 80, height: 80, overflow: "hidden" }}
                    >
                      <img
                        src={img}
                        alt={item.name}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "cover"
                        }}
                      />
                    </div>

                    <div className="flex-grow-1">
                      <Link
                        to={`/products/${item.slug}`}
                        className="text-decoration-none text-dark"
                      >
                        <div className="fw-semibold">{item.name}</div>
                      </Link>
                      <div className="fw-semibold text-primary">
                        {item.price.toLocaleString("vi-VN")} đ
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-2 ms-auto">
                      <div
                        className="input-group input-group-sm"
                        style={{ width: 120 }}
                      >
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() =>
                            updateQty(item._id, Math.max(1, item.qty - 1))
                          }
                        >
                          −
                        </button>
                        <input
                          className="form-control text-center"
                          value={item.qty}
                          onChange={(e) =>
                            updateQty(
                              item._id,
                              Math.max(1, Number(e.target.value) || 1)
                            )
                          }
                        />
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => updateQty(item._id, item.qty + 1)}
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removeFromCart(item._id)}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="col-12 col-lg-4">
            <div className="bg-white rounded-3 shadow-sm p-3">
              <h6 className="mb-3">Tóm tắt đơn hàng</h6>
              <div className="d-flex justify-content-between mb-2">
                <span>Tạm tính</span>
                <span className="fw-semibold">
                  {itemsPrice.toLocaleString("vi-VN")} đ
                </span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Phí vận chuyển</span>
                <span className="fw-semibold">
                  {shippingPrice.toLocaleString("vi-VN")} đ
                </span>
              </div>
              <div className="border-top pt-2 mt-2 d-flex justify-content-between">
                <span className="fw-semibold">Thành tiền</span>
                <span className="fw-bold text-danger fs-5">
                  {totalPrice.toLocaleString("vi-VN")} đ
                </span>
              </div>
              <button
                className="btn btn-primary w-100 mt-3"
                onClick={() => nav("/checkout")}
              >
                Tiến hành thanh toán
              </button>
              <Link to="/products" className="btn btn-link w-100 mt-1">
                Mua thêm sản phẩm khác
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
