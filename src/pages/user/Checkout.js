import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { orderService } from "../../services/orderService";
import { authService } from "../../services/authService"; // Để lấy địa chỉ mới nhất
import ConfirmDialog from "../../components/common/ConfirmDialog";

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
  const [mode, setMode] = useState("select"); // 'select' hoặc 'create'
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [newAddress, setNewAddress] = useState({
    label: "Nhà riêng",
    fullName: user?.name || "",
    phone: user?.phone || "",
    address: ""
  });
  const [note, setNote] = useState("");
  const [placing, setPlacing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Logic phí ship: Đơn >= 1tr free ship, còn lại 30k (giống code cũ)
  const shippingFee = itemsPrice >= 1000000 ? 0 : 30000;
  const grandTotal = itemsPrice + shippingFee;

  // Lấy lại profile để có danh sách địa chỉ mới nhất
  useEffect(() => {
    if (!user) return;
    authService.getMe().then((u) => {
      setContact({
        name: u.name || "",
        email: u.email || "",
        phone: u.phone || ""
      });
      const addrs = u.addresses || [];
      setAddresses(addrs);
      if (addrs.length > 0) {
        const defIndex = addrs.findIndex((a) => a.isDefault);
        setSelectedIndex(defIndex >= 0 ? defIndex : 0);
        setMode("select");
      } else {
        setMode("create");
      }
    });
  }, [user]);

  const handlePlaceOrder = async () => {
    if (placing) return;
    if (!contact.name.trim() || !contact.phone.trim()) {
      setErrorMsg("Vui lòng nhập tên và số điện thoại người nhận.");
      return;
    }

    let shippingInfo = {};
    
    if (mode === "select") {
      if (addresses.length === 0) {
        setErrorMsg("Vui lòng thêm địa chỉ giao hàng.");
        return;
      }
      const addr = addresses[selectedIndex];
      shippingInfo = {
        fullName: addr.fullName,
        phone: addr.phone,
        address: addr.address
      };
    } else {
      if (!newAddress.address.trim()) {
        setErrorMsg("Vui lòng nhập địa chỉ chi tiết.");
        return;
      }
      shippingInfo = {
        fullName: newAddress.fullName || contact.name,
        phone: newAddress.phone || contact.phone,
        address: newAddress.address
      };
    }

    setPlacing(true);
    try {
      const payload = {
        items: cart.map((x) => ({
          productId: x.productId || x._id, // Support cả 2 format
          nameSnapshot: x.name,
          imageSnapshot: x.image || x.thumbnail,
          priceSnapshot: x.price,
          qty: x.qty
        })),
        address: shippingInfo, // Backend mới dùng field 'address' hoặc 'shippingInfo'
        contact: { ...contact, email: user.email }, // Backend dùng field 'contact'
        note,
        itemsPrice,
        shippingPrice: shippingFee,
        total: grandTotal
      };

      const res = await orderService.create(payload);
      clearCart();
      nav("/order-success", { state: { order: res } });
    } catch (e) {
      console.error(e);
      setErrorMsg("Đặt hàng thất bại. Vui lòng thử lại.");
    } finally {
      setPlacing(false);
    }
  };

  if (!cart.length) return <div className="container py-5 text-center">Giỏ hàng trống</div>;

  const currentAddr = mode === "select" ? addresses[selectedIndex] : newAddress;

  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container">
        <h4 className="mb-4">Thanh toán</h4>
        <div className="row g-4">
          <div className="col-lg-8">
            {/* 1. Thông tin liên hệ */}
            <div className="bg-white p-4 rounded-3 shadow-sm mb-3">
              <h6 className="fw-bold mb-3">Thông tin người nhận</h6>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small text-muted">Họ tên</label>
                  <input className="form-control" value={contact.name} onChange={e => setContact({...contact, name: e.target.value})} />
                </div>
                <div className="col-md-6">
                  <label className="form-label small text-muted">Số điện thoại</label>
                  <input className="form-control" value={contact.phone} onChange={e => setContact({...contact, phone: e.target.value})} />
                </div>
                <div className="col-12">
                  <label className="form-label small text-muted">Email (để nhận thông báo)</label>
                  <input className="form-control" value={contact.email} disabled />
                </div>
              </div>
            </div>

            {/* 2. Địa chỉ giao hàng */}
            <div className="bg-white p-4 rounded-3 shadow-sm mb-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0">Địa chỉ giao hàng</h6>
                <div className="btn-group">
                  <button className={`btn btn-sm ${mode === 'select' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setMode('select')}>Chọn có sẵn</button>
                  <button className={`btn btn-sm ${mode === 'create' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setMode('create')}>Nhập mới</button>
                </div>
              </div>

              {mode === 'select' && (
                <div className="vstack gap-2">
                  {addresses.length === 0 && <p className="text-muted small">Chưa có địa chỉ nào được lưu.</p>}
                  {addresses.map((a, idx) => (
                    <label key={idx} className={`d-flex gap-3 p-3 border rounded cursor-pointer ${idx === selectedIndex ? "border-primary bg-primary-subtle" : ""}`}>
                      <input type="radio" name="addr" className="form-check-input mt-1" checked={idx === selectedIndex} onChange={() => setSelectedIndex(idx)} />
                      <div>
                        <div className="fw-bold text-dark">{a.label || "Địa chỉ"} - {a.fullName} ({a.phone})</div>
                        <div className="small text-secondary">{a.address}</div>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {mode === 'create' && (
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small">Tên người nhận</label>
                    <input className="form-control" value={newAddress.fullName} onChange={e => setNewAddress({...newAddress, fullName: e.target.value})} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small">SĐT người nhận</label>
                    <input className="form-control" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} />
                  </div>
                  <div className="col-12">
                    <label className="form-label small">Địa chỉ chi tiết</label>
                    <input className="form-control" placeholder="Số nhà, tên đường, phường/xã..." value={newAddress.address} onChange={e => setNewAddress({...newAddress, address: e.target.value})} />
                  </div>
                </div>
              )}
            </div>

            {/* 3. Ghi chú */}
            <div className="bg-white p-4 rounded-3 shadow-sm">
              <h6 className="fw-bold mb-2">Ghi chú đơn hàng</h6>
              <textarea className="form-control" rows="2" placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..." value={note} onChange={e => setNote(e.target.value)} />
            </div>
          </div>

          <div className="col-lg-4">
            <div className="bg-white p-4 rounded-3 shadow-sm sticky-top" style={{top: 90}}>
              <h5 className="fw-bold mb-3">Đơn hàng</h5>
              <div className="vstack gap-2 mb-3 max-vh-50 overflow-auto">
                {cart.map(item => (
                  <div key={item.productId || item._id} className="d-flex justify-content-between small">
                    <span>{item.name} <span className="text-muted">x{item.qty}</span></span>
                    <span className="fw-bold">{(item.price * item.qty).toLocaleString()}đ</span>
                  </div>
                ))}
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <span>Tạm tính:</span>
                <span>{itemsPrice.toLocaleString()}đ</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Phí vận chuyển:</span>
                <span>{shippingFee === 0 ? "Miễn phí" : `${shippingFee.toLocaleString()}đ`}</span>
              </div>
              <div className="d-flex justify-content-between fs-5 fw-bold text-danger mt-3">
                <span>Tổng cộng:</span>
                <span>{grandTotal.toLocaleString()}đ</span>
              </div>

              {currentAddr && (
                <div className="alert alert-info mt-3 small mb-0">
                  <strong>Giao tới:</strong> {currentAddr.address || "..."}
                </div>
              )}

              <button className="btn btn-primary w-100 mt-3 py-2 fw-bold" onClick={handlePlaceOrder} disabled={placing}>
                {placing ? "Đang xử lý..." : "ĐẶT HÀNG NGAY"}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {errorMsg && (
        <ConfirmDialog 
          show={true} 
          title="Thông báo" 
          message={errorMsg} 
          confirmText="Đóng" 
          showCancel={false} 
          onConfirm={() => setErrorMsg("")} 
        />
      )}
    </div>
  );
}