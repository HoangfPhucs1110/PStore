import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { orderService } from "../../services/orderService";
import { authService } from "../../services/authService";
import { couponService } from "../../services/couponService";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { FiCreditCard, FiTruck, FiTag, FiX, FiCheckCircle, FiAlertCircle, FiArrowLeft } from "react-icons/fi";
import { useNotification } from "../../context/NotificationContext";

// Hàm tiện ích: Đảm bảo giá trị là số
const ensureNumber = (val) => {
    const num = Number(val);
    return isNaN(num) ? 0 : num;
};

export default function Checkout() {
  const { cart, itemsPrice, clearCart } = useCart();
  const { user } = useAuth();
  const nav = useNavigate();
  const { notify } = useNotification();

  // Contact: Chỉ giữ Tên và Email (Bỏ SĐT ở đây)
  const [contact, setContact] = useState({ name: "", email: "" });
  
  const [addresses, setAddresses] = useState([]);
  const [mode, setMode] = useState("create"); // Mặc định là create cho Guest
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // Address: Bao gồm SĐT nhận hàng
  const [newAddress, setNewAddress] = useState({ label: "Nhà riêng", fullName: "", phone: "", address: "" });
  
  const [note, setNote] = useState("");
  const [placing, setPlacing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");

  // Coupon State
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");

  // --- TÍNH TOÁN AN TOÀN ---
  const { safeItemsPrice, shippingFee, grandTotal } = useMemo(() => {
      const price = ensureNumber(itemsPrice);
      const ship = price >= 1000000 ? 0 : 30000;
      const disc = ensureNumber(discount);
      const total = Math.max(0, price + ship - disc);
      
      return { safeItemsPrice: price, shippingFee: ship, grandTotal: total };
  }, [itemsPrice, discount]);

  // Load thông tin User nếu đã đăng nhập
  useEffect(() => {
    if (user) {
      authService.getMe().then((u) => {
        setContact({ name: u.name || "", email: u.email || "" });
        const addrs = u.addresses || [];
        setAddresses(addrs);
        if (addrs.length > 0) {
            setSelectedIndex(addrs.findIndex((a) => a.isDefault) > -1 ? addrs.findIndex((a) => a.isDefault) : 0);
            setMode("select");
        } else {
            setMode("create");
        }
      });
    }
  }, [user]);

  // --- XỬ LÝ COUPON ---
  const handleApplyCoupon = async () => {
      if (!couponCode.trim()) { setCouponError("Vui lòng nhập mã"); return; }
      setLoadingCoupon(true); setCouponError(""); 

      try {
          const res = await couponService.apply(couponCode, safeItemsPrice);
          let calculatedDiscount = 0;

          // Logic tính giảm giá
          if (res.discountAmount !== undefined && res.discountAmount !== null) {
              calculatedDiscount = ensureNumber(res.discountAmount);
          } else if (res.type && res.value) {
              const val = ensureNumber(res.value);
              if (res.type === 'percent') {
                  calculatedDiscount = (safeItemsPrice * val) / 100;
                  if (res.maxDiscount) {
                      const maxDisc = ensureNumber(res.maxDiscount);
                      if (maxDisc > 0) calculatedDiscount = Math.min(calculatedDiscount, maxDisc);
                  }
              } else {
                  calculatedDiscount = val;
              }
          }

          const minOrder = ensureNumber(res.minOrder);
          if (minOrder > 0 && safeItemsPrice < minOrder) {
             throw new Error(`Đơn hàng phải từ ${minOrder.toLocaleString()}đ mới được dùng mã này`);
          }

          setDiscount(Math.round(calculatedDiscount));
          setAppliedCoupon(res.code || couponCode); 
          notify("Áp dụng mã thành công!", "success");

      } catch (err) {
          setDiscount(0); setAppliedCoupon(null);
          setCouponError(err.message || err.response?.data?.message || "Mã không hợp lệ");
      } finally { setLoadingCoupon(false); }
  };

  const removeCoupon = () => { setDiscount(0); setAppliedCoupon(null); setCouponCode(""); setCouponError(""); };

  // --- XỬ LÝ ĐẶT HÀNG ---
  const handlePlaceOrder = async () => {
    if (placing) return;
    
    // Validate Contact (Tên & Email)
    if (!contact.name.trim() || !contact.email.trim()) return setErrorMsg("Vui lòng nhập Họ tên và Email để nhận thông báo.");

    if (paymentMethod === "PAYOS" && grandTotal < 2000) {
        return setErrorMsg("Thanh toán PayOS yêu cầu đơn hàng tối thiểu 2.000đ.");
    }

    let shippingInfo = {};
    if (mode === "select" && user) {
      if (addresses.length === 0) return setErrorMsg("Vui lòng thêm địa chỉ giao hàng.");
      const addr = addresses[selectedIndex];
      shippingInfo = { fullName: addr.fullName, phone: addr.phone, address: addr.address };
    } else {
      // Validate Address (SĐT & Địa chỉ)
      if (!newAddress.phone.trim()) return setErrorMsg("Vui lòng nhập Số điện thoại nhận hàng.");
      if (!newAddress.address.trim()) return setErrorMsg("Vui lòng nhập Địa chỉ chi tiết.");
      
      shippingInfo = { 
          fullName: newAddress.fullName || contact.name, 
          phone: newAddress.phone, 
          address: newAddress.address 
      };
    }

    setPlacing(true);
    try {
      const payload = {
        items: cart.map((x) => ({
          productId: x.productId || x._id,
          nameSnapshot: x.name,
          imageSnapshot: x.image || x.thumbnail,
          priceSnapshot: x.price,
          qty: x.qty
        })),
        address: shippingInfo,
        shippingInfo,
        contact: { ...contact }, // Chỉ chứa name và email
        note,
        itemsPrice: safeItemsPrice,
        shippingPrice: shippingFee,
        discount, 
        total: grandTotal, 
        paymentMethod: paymentMethod === 'PAYOS' ? 'PAYOS' : 'COD',
        paymentStatus: 'unpaid'
      };

      const res = await orderService.create(payload);
      
      if (paymentMethod === "PAYOS") {
          const payRes = await orderService.createPaymentLink({ orderId: res._id, amount: grandTotal });
          if (payRes.paymentUrl) {
              // Không clear giỏ để nếu hủy còn quay lại được
              window.location.href = payRes.paymentUrl;
          }
      } else {
          clearCart();
          nav("/order-success", { state: { order: res } });
      }

    } catch (e) {
      setErrorMsg(e.response?.data?.message || "Đặt hàng thất bại. Vui lòng thử lại.");
      setPlacing(false);
    }
  };

  if (!cart.length) return <div className="container py-5 text-center"><h4>Giỏ hàng trống</h4><button className="btn btn-primary mt-3" onClick={() => nav("/products")}>Mua sắm ngay</button></div>;

  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container">
        <div className="mb-3">
            <button className="btn btn-link text-decoration-none text-muted p-0 d-flex align-items-center gap-2 hover-text-primary" onClick={() => nav("/cart")}>
                <FiArrowLeft /> Quay lại giỏ hàng
            </button>
        </div>

        <h4 className="mb-4 fw-bold">Thanh toán</h4>
        <div className="row g-4">
          <div className="col-lg-8">
            {/* 1. THÔNG TIN LIÊN HỆ */}
            <div className="bg-white p-4 rounded-3 shadow-sm mb-3">
              <h6 className="fw-bold mb-3">Thông tin liên hệ</h6>
              <div className="row g-3">
                <div className="col-md-6">
                    <label className="form-label small text-muted">Họ tên</label>
                    <input className="form-control" value={contact.name} onChange={e => setContact({...contact, name: e.target.value})} placeholder="Nguyễn Văn A" />
                </div>
                <div className="col-md-6">
                    <label className="form-label small text-muted">Email (Nhận thông báo)</label>
                    <input className="form-control" type="email" value={contact.email} onChange={e => setContact({...contact, email: e.target.value})} placeholder="email@example.com" />
                </div>
              </div>
            </div>

            {/* 2. ĐỊA CHỈ GIAO HÀNG */}
            <div className="bg-white p-4 rounded-3 shadow-sm mb-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0">Địa chỉ nhận hàng</h6>
                {user && (
                    <div className="btn-group">
                        <button className={`btn btn-sm ${mode === 'select' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setMode('select')}>Sổ địa chỉ</button>
                        <button className={`btn btn-sm ${mode === 'create' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setMode('create')}>Nhập mới</button>
                    </div>
                )}
              </div>

              {mode === 'select' && user && (
                <div className="vstack gap-2">
                  {addresses.length === 0 && <p className="text-muted small">Chưa có địa chỉ lưu.</p>}
                  {addresses.map((a, idx) => (
                    <label key={idx} className={`d-flex gap-3 p-3 border rounded cursor-pointer ${idx === selectedIndex ? "border-primary bg-primary-subtle" : ""}`}>
                      <input type="radio" name="addr" className="form-check-input mt-1" checked={idx === selectedIndex} onChange={() => setSelectedIndex(idx)} />
                      <div><div className="fw-bold text-dark">{a.label} - {a.fullName} ({a.phone})</div><div className="small text-secondary">{a.address}</div></div>
                    </label>
                  ))}
                </div>
              )}

              {(mode === 'create' || !user) && (
                <div className="row g-3">
                  <div className="col-md-6">
                      <label className="form-label small">Tên người nhận</label>
                      <input className="form-control" value={newAddress.fullName} onChange={e => setNewAddress({...newAddress, fullName: e.target.value})} placeholder="Nhập tên người nhận" />
                  </div>
                  <div className="col-md-6">
                      <label className="form-label small fw-bold">Số điện thoại <span className="text-danger">*</span></label>
                      <input className="form-control" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} placeholder="Shipper sẽ gọi số này" />
                  </div>
                  <div className="col-12">
                      <label className="form-label small">Địa chỉ chi tiết <span className="text-danger">*</span></label>
                      <input className="form-control" value={newAddress.address} onChange={e => setNewAddress({...newAddress, address: e.target.value})} placeholder="Số nhà, đường, phường, quận..." />
                  </div>
                </div>
              )}
            </div>

            {/* 3. PHƯƠNG THỨC THANH TOÁN */}
            <div className="bg-white p-4 rounded-3 shadow-sm mb-3">
                <h6 className="fw-bold mb-3">Phương thức thanh toán</h6>
                <div className="d-flex flex-column gap-2">
                    <label className={`d-flex align-items-center gap-3 border rounded p-3 cursor-pointer ${paymentMethod === 'COD' ? 'border-primary bg-primary-subtle' : ''}`}>
                        <input type="radio" name="paymentMethod" className="form-check-input mt-0" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                        <FiTruck size={24} className="text-secondary"/>
                        <div><div className="fw-bold">Thanh toán khi nhận hàng (COD)</div></div>
                    </label>
                    <label className={`d-flex align-items-center gap-3 border rounded p-3 cursor-pointer ${paymentMethod === 'PAYOS' ? 'border-primary bg-primary-subtle' : ''}`}>
                        <input type="radio" name="paymentMethod" className="form-check-input mt-0" checked={paymentMethod === 'PAYOS'} onChange={() => setPaymentMethod('PAYOS')} />
                        <FiCreditCard size={24} className="text-primary"/>
                        <div><div className="fw-bold">Thanh toán Online (PayOS)</div></div>
                    </label>
                </div>
            </div>
            
            <div className="bg-white p-4 rounded-3 shadow-sm"><h6 className="fw-bold mb-2">Ghi chú</h6><textarea className="form-control" rows="2" value={note} onChange={e => setNote(e.target.value)} /></div>
          </div>

          <div className="col-lg-4">
            <div className="bg-white p-4 rounded-3 shadow-sm sticky-top" style={{top: 90}}>
              <h5 className="fw-bold mb-3">Đơn hàng</h5>
              <div className="vstack gap-2 mb-3 max-vh-50 overflow-auto border-bottom pb-3">
                {cart.map(item => (
                  <div key={item.productId} className="d-flex justify-content-between small">
                    <span>{item.name} <span className="text-muted">x{item.qty}</span></span>
                    <span className="fw-bold">{(item.price * item.qty).toLocaleString()}đ</span>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                  <label className="form-label small fw-bold text-muted">Mã giảm giá</label>
                  <div className="input-group">
                      <input className="form-control" placeholder="Nhập mã..." value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())} disabled={!!appliedCoupon} />
                      {appliedCoupon ? (
                          <button className="btn btn-danger" onClick={removeCoupon}><FiX/></button>
                      ) : (
                          <button className="btn btn-dark" onClick={handleApplyCoupon} disabled={loadingCoupon}>{loadingCoupon ? "..." : "Áp dụng"}</button>
                      )}
                  </div>
                  {appliedCoupon && <div className="small text-success mt-2 d-flex align-items-center animate-fade-in"><FiCheckCircle className="me-1"/> Đã dùng mã: <strong>{appliedCoupon}</strong> (-{Number(discount).toLocaleString()}đ)</div>}
                  {couponError && <div className="small text-danger mt-2 d-flex align-items-center animate-fade-in"><FiAlertCircle className="me-1"/> {couponError}</div>}
              </div>

              <div className="d-flex justify-content-between mb-2 text-secondary"><span>Tạm tính:</span><span>{Number(safeItemsPrice).toLocaleString()}đ</span></div>
              <div className="d-flex justify-content-between mb-2 text-secondary"><span>Phí vận chuyển:</span><span>{shippingFee.toLocaleString()}đ</span></div>
              {discount > 0 && <div className="d-flex justify-content-between mb-2 text-success fw-bold"><span>Giảm giá:</span><span>-{Number(discount).toLocaleString()}đ</span></div>}
              <div className="d-flex justify-content-between fs-4 fw-bold text-danger mt-3 pt-3 border-top"><span>Tổng cộng:</span><span>{Number(grandTotal).toLocaleString()}đ</span></div>

              <button className="btn btn-primary w-100 mt-4 py-3 fw-bold shadow-sm" onClick={handlePlaceOrder} disabled={placing}>
                {placing ? "Đang xử lý..." : (paymentMethod === 'PAYOS' ? "THANH TOÁN" : "ĐẶT HÀNG")}
              </button>
            </div>
          </div>
        </div>
      </div>
      {errorMsg && <ConfirmDialog show={true} title="Thông báo" message={errorMsg} confirmText="Đóng" showCancel={false} onConfirm={() => setErrorMsg("")} />}
    </div>
  );
}