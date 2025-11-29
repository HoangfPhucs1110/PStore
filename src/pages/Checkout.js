import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import ConfirmDialog from "../components/ConfirmDialog";

export default function Checkout() {
  const { cart, itemsPrice, clearCart } = useCart();
  const { user } = useAuth();
  const nav = useNavigate();

  const [contact, setContact] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || ""
  });
  const [addresses, setAddresses] = useState([]);
  const [mode, setMode] = useState("select");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [newAddress, setNewAddress] = useState({
    label: "Nhà riêng",
    fullName: user?.name || "",
    phone: user?.phone || "",
    address: ""
  });
  const [note, setNote] = useState("");
  const [placing, setPlacing] = useState(false);
  const [dialog, setDialog] = useState({
    open: false,
    title: "",
    message: "",
    confirmText: "Đóng",
    cancelText: "Đóng",
    onConfirm: null
  });

  const showDialog = (message, title = "Thông báo") =>
    setDialog({
      open: true,
      title,
      message,
      confirmText: "Đóng",
      cancelText: "Đóng",
      onConfirm: null
    });

  // tính ship: đơn >= 1tr free ship, còn lại 30k
  const BASE_SHIP = 30000;
  const shippingFee = itemsPrice >= 1000000 ? 0 : BASE_SHIP;
  const grandTotal = itemsPrice + shippingFee;

  useEffect(() => {
    if (!user) return;
    api
      .get("/auth/profile")
      .then((res) => {
        const d = res.data || {};
        setContact({
          name: d.name || user.name || "",
          email: d.email || user.email || "",
          phone: d.phone || user.phone || ""
        });
        const addrs = d.addresses || [];
        setAddresses(addrs);
        if (addrs.length) {
          const defIndex = addrs.findIndex((a) => a.isDefault);
          setSelectedIndex(defIndex >= 0 ? defIndex : 0);
          setMode("select");
        } else {
          setMode("create");
          setNewAddress((prev) => ({
            ...prev,
            fullName: d.name || user.name || "",
            phone: d.phone || user.phone || ""
          }));
        }
      })
      .catch((err) => console.error("GET /auth/profile", err));
  }, [user]);

  if (!cart.length)
    return (
      <div className="container my-3">
        <h5>Thanh toán</h5>
        <p className="text-muted">Giỏ hàng của bạn đang trống.</p>
      </div>
    );

  const handlePlaceOrder = async () => {
    if (placing) return;

    if (!contact.name.trim() || !contact.phone.trim()) {
      showDialog("Vui lòng nhập đầy đủ họ tên và số điện thoại người nhận.");
      return;
    }

    let shippingAddress;
    if (mode === "select") {
      if (!addresses.length) {
        showDialog("Vui lòng thêm ít nhất một địa chỉ giao hàng.");
        return;
      }
      shippingAddress = addresses[selectedIndex];
      if (!shippingAddress) {
        showDialog("Vui lòng chọn một địa chỉ giao hàng.");
        return;
      }
    } else {
      if (
        !newAddress.fullName.trim() ||
        !newAddress.phone.trim() ||
        !newAddress.address.trim()
      ) {
        showDialog("Vui lòng nhập đầy đủ thông tin địa chỉ giao hàng.");
        return;
      }
      shippingAddress = newAddress;
    }

    setPlacing(true);
    try {
      const payload = {
        items: cart.map((x) => ({
          productId: x._id,
          nameSnapshot: x.name,
          imageSnapshot: x.image,
          priceSnapshot: x.price,
          qty: x.qty
        })),
        // cho backend cũ + mới đều hiểu
        itemsPrice,
        shippingPrice: shippingFee,
        totalPrice: grandTotal,
        subtotal: itemsPrice,
        shippingFee,
        discount: 0,
        total: grandTotal,
        shippingInfo: {
          fullName: shippingAddress.fullName || contact.name,
          phone: shippingAddress.phone || contact.phone,
          address: shippingAddress.address
        },
        address: shippingAddress,
        contact,
        note
      };

      const res = await api.post("/orders", payload);
      clearCart();
      nav("/order-success", { state: { order: res.data } });
    } catch (e) {
      console.error("POST /orders", e);
      showDialog(
        e.response?.data?.message || "Đặt hàng thất bại, vui lòng thử lại sau."
      );
    } finally {
      setPlacing(false);
    }
  };

  const currentAddress =
    mode === "select" ? addresses[selectedIndex] : newAddress;

  return (
    <div className="container my-3">
      <h5 className="mb-3">Thanh toán</h5>
      <div className="row g-3">
        <div className="col-lg-8">
          <div className="bg-white rounded-3 shadow-sm p-3 mb-3">
            <h6 className="mb-3">Thông tin người nhận</h6>
            <div className="row g-2">
              <div className="col-md-6">
                <label className="form-label small mb-1">Họ tên</label>
                <input
                  className="form-control form-control-sm"
                  value={contact.name}
                  onChange={(e) =>
                    setContact({ ...contact, name: e.target.value })
                  }
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small mb-1">Email</label>
                <input
                  className="form-control form-control-sm"
                  value={contact.email}
                  disabled
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small mb-1">
                  Số điện thoại nhận hàng
                </label>
                <input
                  className="form-control form-control-sm"
                  value={contact.phone}
                  onChange={(e) =>
                    setContact({ ...contact, phone: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3 shadow-sm p-3 mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="mb-0">Địa chỉ giao hàng</h6>
              <div className="btn-group btn-group-sm">
                <button
                  type="button"
                  className={
                    "btn " + (mode === "select" ? "btn-primary" : "btn-light")
                  }
                  onClick={() => setMode("select")}
                >
                  Chọn địa chỉ đã lưu
                </button>
                <button
                  type="button"
                  className={
                    "btn " + (mode === "create" ? "btn-primary" : "btn-light")
                  }
                  onClick={() => setMode("create")}
                >
                  Thêm địa chỉ mới
                </button>
              </div>
            </div>

            {mode === "select" && addresses.length > 0 && (
              <div className="vstack gap-2 mb-2">
                {addresses.map((addr, idx) => (
                  <label
                    key={idx}
                    className={
                      "border rounded-3 p-2 d-flex align-items-start gap-2" +
                      (idx === selectedIndex ? " border-primary" : "")
                    }
                  >
                    <input
                      type="radio"
                      className="form-check-input mt-1"
                      checked={idx === selectedIndex}
                      onChange={() => setSelectedIndex(idx)}
                    />
                    <div>
                      <div className="fw-semibold small">
                        {addr.label ? `[${addr.label}] ` : ""}
                        {addr.fullName} – {addr.phone}
                      </div>
                      <div className="small text-muted">{addr.address}</div>
                      {addr.isDefault && (
                        <span className="badge bg-primary bg-opacity-75 mt-1">
                          Mặc định
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}

            {(mode === "create" || addresses.length === 0) && (
              <div className="mt-2">
                {addresses.length === 0 && (
                  <p className="small text-muted mb-2">
                    Bạn chưa có địa chỉ nào, hãy thêm địa chỉ giao hàng cho đơn
                    này.
                  </p>
                )}
                <div className="row g-2">
                  <div className="col-md-3">
                    <label className="form-label small mb-1">Nhãn</label>
                    <input
                      className="form-control form-control-sm"
                      value={newAddress.label}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          label: e.target.value
                        })
                      }
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small mb-1">
                      Tên người nhận
                    </label>
                    <input
                      className="form-control form-control-sm"
                      value={newAddress.fullName}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          fullName: e.target.value
                        })
                      }
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small mb-1">
                      Số điện thoại
                    </label>
                    <input
                      className="form-control form-control-sm"
                      value={newAddress.phone}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          phone: e.target.value
                        })
                      }
                    />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label small mb-1">
                      Địa chỉ chi tiết
                    </label>
                    <input
                      className="form-control form-control-sm"
                      placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                      value={newAddress.address}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          address: e.target.value
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-3 shadow-sm p-3">
            <h6 className="mb-2">Ghi chú cho đơn hàng</h6>
            <textarea
              className="form-control"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ví dụ: Gọi trước khi giao, giao giờ hành chính..."
            />
          </div>
        </div>

        <div className="col-lg-4">
          <div className="bg-white rounded-3 shadow-sm p-3">
            <h6 className="mb-3">Tóm tắt đơn hàng</h6>

            <div className="mb-3">
              {cart.map((x) => (
                <div
                  key={x._id}
                  className="d-flex justify-content-between small mb-1"
                >
                  <div>
                    <div className="fw-semibold">{x.name}</div>
                  </div>
                  <div>
                    x{x.qty}{" "}
                    <span className="text-muted">
                      ({x.price.toLocaleString()} đ)
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="d-flex justify-content-between mb-1">
              <span>Tạm tính</span>
              <span>{itemsPrice.toLocaleString()} đ</span>
            </div>
            <div className="d-flex justify-content-between mb-1">
              <span>Phí vận chuyển</span>
              <span>
                {shippingFee
                  ? shippingFee.toLocaleString("vi-VN") + " đ"
                  : "Miễn phí"}
              </span>
            </div>
            <hr />
            <div className="d-flex justify-content-between mb-3 fw-semibold">
              <span>Tổng cộng</span>
              <span className="text-danger">
                {grandTotal.toLocaleString("vi-VN")} đ
              </span>
            </div>

            {currentAddress && currentAddress.address && (
              <div className="mb-3 small text-muted">
                <div className="fw-semibold mb-1">Giao đến:</div>
                <div>
                  {(currentAddress.label
                    ? `[${currentAddress.label}] `
                    : "") + currentAddress.fullName}{" "}
                  – {currentAddress.phone}
                </div>
                <div>{currentAddress.address}</div>
              </div>
            )}

            <button
              className="btn btn-primary w-100"
              onClick={handlePlaceOrder}
              disabled={placing}
            >
              {placing ? "Đang đặt hàng..." : "Đặt hàng"}
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={dialog.open}
        title={dialog.title}
        message={dialog.message}
        confirmText={dialog.confirmText}
        cancelText={dialog.cancelText}
        onConfirm={() => {
          if (dialog.onConfirm) dialog.onConfirm();
          setDialog((d) => ({ ...d, open: false, onConfirm: null }));
        }}
        onCancel={() =>
          setDialog((d) => ({ ...d, open: false, onConfirm: null }))
        }
      />
    </div>
  );
}
