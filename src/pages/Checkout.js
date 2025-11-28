import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import ConfirmDialog from "../components/ConfirmDialog";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const nav = useNavigate();

  const [addressList, setAddressList] = useState(user?.addresses || []);
  const [selectedIndex, setSelectedIndex] = useState(
    user?.addresses && user.addresses.length > 0 ? 0 : -1
  );
  const [newAddr, setNewAddr] = useState({ fullName: "", phone: "", address: "" });
  const [useNew, setUseNew] = useState(addressList.length === 0);
  const [payment, setPayment] = useState("COD");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [dialog, setDialog] = useState(null);

  const subtotal = cart.reduce((s, x) => s + x.price * x.qty, 0);
  const shippingFee = 0;
  const total = Math.max(0, subtotal + shippingFee - discount);

  useEffect(() => {
    if (!user) return;
    setAddressList(user.addresses || []);
  }, [user]);

  const validateAddress = (addr) => {
    if (!addr.fullName.trim() || !addr.phone.trim() || !addr.address.trim())
      return false;
    return true;
  };

  const handleUseNewAddress = async () => {
    if (!validateAddress(newAddr)) {
      setDialog({
        type: "error",
        title: "Thiếu thông tin",
        message: "Vui lòng nhập đầy đủ họ tên, số điện thoại và địa chỉ."
      });
      return;
    }
    try {
      const res = await api.post("/auth/addresses", newAddr);
      setAddressList(res.data.addresses);
      setSelectedIndex(res.data.addresses.length - 1);
      setUseNew(false);
      setNewAddr({ fullName: "", phone: "", address: "" });
    } catch (err) {
      setDialog({
        type: "error",
        title: "Lỗi",
        message: err.response?.data?.message || "Không thêm được địa chỉ."
      });
    }
  };

  const applyCoupon = async () => {
    if (!coupon.trim()) return;
    try {
      const res = await api.post("/coupons/apply", {
        code: coupon.trim(),
        subtotal
      });
      setDiscount(res.data.discount || 0);
      setDialog({
        type: "success",
        title: "Áp dụng mã",
        message: "Mã giảm giá đã được áp dụng."
      });
    } catch (err) {
      setDiscount(0);
      setDialog({
        type: "error",
        title: "Mã không hợp lệ",
        message: err.response?.data?.message || "Không áp dụng được mã giảm giá."
      });
    }
  };

  const placeOrder = async () => {
    const addr = useNew
      ? newAddr
      : addressList[selectedIndex] || { fullName: "", phone: "", address: "" };
    if (!validateAddress(addr)) {
      setDialog({
        type: "error",
        title: "Thiếu thông tin",
        message: "Vui lòng nhập đầy đủ thông tin giao hàng."
      });
      return;
    }
    if (cart.length === 0) {
      setDialog({
        type: "error",
        title: "Giỏ hàng trống",
        message: "Bạn chưa có sản phẩm nào trong giỏ hàng."
      });
      return;
    }
    try {
      const res = await api.post("/orders", {
        items: cart.map((c) => ({
          productId: c._id,
          qty: c.qty,
          priceSnapshot: c.price,
          nameSnapshot: c.name
        })),
        paymentMethod: payment,
        shippingInfo: addr,
        subtotal,
        discount,
        shippingFee,
        total
      });
      clearCart();
      setDialog({
        type: "success",
        title: "Đặt hàng thành công",
        message: `Mã đơn hàng: ${res.data._id || ""}`,
        afterConfirm: () => nav("/")
      });
    } catch (err) {
      setDialog({
        type: "error",
        title: "Lỗi đặt hàng",
        message: err.response?.data?.message || "Không thể đặt hàng lúc này."
      });
    }
  };

  if (cart.length === 0)
    return (
      <div className="container my-4">
        <h5>Thanh toán</h5>
        <p className="text-muted">Giỏ hàng đang trống, vui lòng chọn sản phẩm.</p>
      </div>
    );

  return (
    <div className="container my-4">
      <h5 className="mb-3">Thanh toán</h5>
      <div className="row g-3">
        <div className="col-lg-8">
          <div className="bg-white rounded-3 shadow-sm p-3 mb-3">
            <h6 className="mb-2">Thông tin giao hàng</h6>

            {addressList.length > 0 && (
              <>
                <div className="mb-2 small text-muted">
                  Chọn địa chỉ đã lưu hoặc thêm địa chỉ mới.
                </div>
                {addressList.map((addr, idx) => (
                  <div
                    key={idx}
                    className={
                      "border rounded p-2 mb-2 hover-bg " +
                      (selectedIndex === idx && !useNew ? "border-primary" : "")
                    }
                  >
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="address"
                        checked={selectedIndex === idx && !useNew}
                        onChange={() => {
                          setUseNew(false);
                          setSelectedIndex(idx);
                        }}
                      />
                      <label className="form-check-label ms-1">
                        <strong>{addr.fullName}</strong> | {addr.phone}
                        <div className="small text-muted">{addr.address}</div>
                      </label>
                    </div>
                  </div>
                ))}
              </>
            )}

            <div className="form-check mt-2 mb-2">
              <input
                className="form-check-input"
                type="radio"
                name="address"
                checked={useNew || addressList.length === 0}
                onChange={() => setUseNew(true)}
              />
              <label className="form-check-label">
                Sử dụng địa chỉ mới cho đơn hàng này
              </label>
            </div>

            {useNew && (
              <div className="border rounded p-3 mt-2 bg-light">
                <div className="mb-2">
                  <label className="form-label">Họ tên</label>
                  <input
                    className="form-control"
                    value={newAddr.fullName}
                    onChange={(e) =>
                      setNewAddr({ ...newAddr, fullName: e.target.value })
                    }
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Số điện thoại</label>
                  <input
                    className="form-control"
                    value={newAddr.phone}
                    onChange={(e) =>
                      setNewAddr({ ...newAddr, phone: e.target.value })
                    }
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Địa chỉ</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={newAddr.address}
                    onChange={(e) =>
                      setNewAddr({ ...newAddr, address: e.target.value })
                    }
                  />
                </div>
                {user && (
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={handleUseNewAddress}
                  >
                    Lưu địa chỉ vào tài khoản
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="bg-white rounded-3 shadow-sm p-3">
            <h6 className="mb-2">Phương thức thanh toán</h6>
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="radio"
                name="payment"
                checked={payment === "COD"}
                onChange={() => setPayment("COD")}
              />
              <label className="form-check-label">
                Thanh toán khi nhận hàng (COD)
              </label>
            </div>
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="radio"
                name="payment"
                checked={payment === "BANK"}
                onChange={() => setPayment("BANK")}
              />
              <label className="form-check-label">
                Chuyển khoản ngân hàng (hiển thị thông tin sau khi đặt)
              </label>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="bg-white rounded-3 shadow-sm p-3 mb-3">
            <h6 className="mb-2">Mã giảm giá</h6>
            <div className="input-group mb-2">
              <input
                className="form-control"
                placeholder="Nhập mã giảm giá"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
              <button
                className="btn btn-outline-primary"
                type="button"
                onClick={applyCoupon}
              >
                Áp dụng
              </button>
            </div>
            {discount > 0 && (
              <div className="small text-success">
                Đã áp dụng giảm giá: -{discount.toLocaleString()} đ
              </div>
            )}
          </div>

          <div className="bg-white rounded-3 shadow-sm p-3">
            <h6 className="mb-3">Tóm tắt đơn hàng</h6>
            <div className="d-flex justify-content-between mb-1">
              <span>Tạm tính</span>
              <span>{subtotal.toLocaleString()} đ</span>
            </div>
            <div className="d-flex justify-content-between mb-1">
              <span>Giảm giá</span>
              <span>-{discount.toLocaleString()} đ</span>
            </div>
            <div className="d-flex justify-content-between mb-1">
              <span>Phí vận chuyển</span>
              <span>{shippingFee === 0 ? "Miễn phí" : `${shippingFee} đ`}</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between mb-3 fw-semibold">
              <span>Tổng thanh toán</span>
              <span className="text-danger">{total.toLocaleString()} đ</span>
            </div>
            <button className="btn btn-primary w-100" onClick={placeOrder}>
              ĐẶT HÀNG NGAY
            </button>
          </div>
        </div>
      </div>

      {dialog && (
        <ConfirmDialog
          title={dialog.title}
          message={dialog.message}
          confirmText="Đồng ý"
          cancelText="Đóng"
          showCancel={dialog.type !== "success"}
          onConfirm={() => {
            const cb = dialog.afterConfirm;
            setDialog(null);
            if (cb) cb();
          }}
          onClose={() => setDialog(null)}
        />
      )}
    </div>
  );
}
