import { useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { couponService } from "../../services/couponService";
import { useNotification } from "../../context/NotificationContext";
import { FiTrash2, FiEdit2, FiPlus, FiSave, FiX, FiTag } from "react-icons/fi";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({
    code: "", type: "percent", value: 0, minOrder: 0, maxDiscount: 0, usageLimit: 100, endDate: ""
  });
  const [editingId, setEditingId] = useState(null);
  const { notify, confirm } = useNotification();

  const loadCoupons = () => {
    couponService.getAll().then(setCoupons).catch(console.error);
  };

  useEffect(() => { loadCoupons(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const payload = { ...form, code: form.code.toUpperCase() };
        if (editingId) {
            await couponService.update(editingId, payload);
            notify("Cập nhật thành công", "success");
        } else {
            await couponService.create(payload);
            notify("Thêm mã mới thành công", "success");
        }
        setEditingId(null);
        setForm({ code: "", type: "percent", value: 0, minOrder: 0, maxDiscount: 0, usageLimit: 100, endDate: "" });
        loadCoupons();
    } catch (err) {
        notify(err.response?.data?.message || "Lỗi lưu mã", "error");
    }
  };

  const handleEdit = (c) => {
      setEditingId(c._id);
      setForm({
          code: c.code, type: c.type, value: c.value, minOrder: c.minOrder, 
          maxDiscount: c.maxDiscount, usageLimit: c.usageLimit, 
          endDate: c.endDate ? c.endDate.split('T')[0] : ""
      });
  };

  const handleDelete = (id) => {
      confirm("Xóa mã này?", async () => {
          try {
              await couponService.delete(id);
              notify("Đã xóa", "success");
              loadCoupons();
          } catch { notify("Lỗi xóa", "error"); }
      });
  };

  return (
    <div className="d-flex bg-light min-vh-100">
      <AdminSidebar />
      <div className="flex-grow-1 p-4">
        <h4 className="fw-bold mb-4">Quản lý Mã Giảm Giá</h4>
        <div className="row g-4">
            {/* FORM */}
            <div className="col-md-4">
                <div className={`card border-0 shadow-sm p-3 ${editingId ? "border-primary border-2" : ""}`}>
                    <h6 className="fw-bold mb-3 text-primary">{editingId ? "Cập nhật mã" : "Thêm mã mới"}</h6>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-2"><label className="form-label small">Mã Code</label><input className="form-control text-uppercase fw-bold" value={form.code} onChange={e=>setForm({...form, code: e.target.value})} placeholder="VD: SALE50" required/></div>
                        <div className="row g-2 mb-2">
                            <div className="col-6"><label className="form-label small">Loại giảm</label><select className="form-select" value={form.type} onChange={e=>setForm({...form, type: e.target.value})}><option value="percent">Theo %</option><option value="fixed">Số tiền (VNĐ)</option></select></div>
                            <div className="col-6"><label className="form-label small">Giá trị giảm</label><input type="number" className="form-control" value={form.value} onChange={e=>setForm({...form, value: e.target.value})} required/></div>
                        </div>
                        <div className="mb-2"><label className="form-label small">Đơn tối thiểu</label><input type="number" className="form-control" value={form.minOrder} onChange={e=>setForm({...form, minOrder: e.target.value})}/></div>
                        {form.type === "percent" && <div className="mb-2"><label className="form-label small">Giảm tối đa</label><input type="number" className="form-control" value={form.maxDiscount} onChange={e=>setForm({...form, maxDiscount: e.target.value})}/></div>}
                        <div className="row g-2 mb-3">
                            <div className="col-6"><label className="form-label small">Lượt dùng</label><input type="number" className="form-control" value={form.usageLimit} onChange={e=>setForm({...form, usageLimit: e.target.value})}/></div>
                            <div className="col-6"><label className="form-label small">Hết hạn</label><input type="date" className="form-control" value={form.endDate} onChange={e=>setForm({...form, endDate: e.target.value})}/></div>
                        </div>
                        <div className="d-flex gap-2"><button className="btn btn-primary w-100">{editingId ? "Lưu" : "Thêm"}</button>{editingId && <button type="button" className="btn btn-light" onClick={()=>{setEditingId(null); setForm({ code: "", type: "percent", value: 0, minOrder: 0, maxDiscount: 0, usageLimit: 100, endDate: "" });}}>Hủy</button>}</div>
                    </form>
                </div>
            </div>
            {/* LIST */}
            <div className="col-md-8">
                <div className="card border-0 shadow-sm">
                    <table className="table table-hover align-middle mb-0 small">
                        <thead className="table-light">
                            <tr>
                                <th className="ps-3">Mã</th>
                                <th>Giảm</th>
                                <th>Điều kiện</th>
                                <th>Còn lại / Tổng</th> {/* CỘT MỚI THÊM */}
                                <th>Hạn dùng</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coupons.map(c => (
                                <tr key={c._id}>
                                    <td className="ps-3 fw-bold text-primary">{c.code}</td>
                                    <td>{c.type === 'percent' ? `${c.value}%` : `${c.value.toLocaleString()}đ`}</td>
                                    <td>Min: {c.minOrder.toLocaleString()}đ</td>
                                    
                                    {/* HIỂN THỊ SỐ LƯỢNG */}
                                    <td>
                                        <span className={`fw-bold ${c.usageLimit - c.usedCount <= 0 ? "text-danger" : "text-success"}`}>
                                            {c.usageLimit - c.usedCount}
                                        </span>
                                        <span className="text-muted"> / {c.usageLimit}</span>
                                    </td>

                                    <td>{c.endDate ? new Date(c.endDate).toLocaleDateString() : "Vô thời hạn"}</td>
                                    <td>
                                        <button className="btn btn-light text-primary btn-sm me-2" onClick={() => handleEdit(c)}><FiEdit2/></button>
                                        <button className="btn btn-light text-danger btn-sm" onClick={() => handleDelete(c._id)}><FiTrash2/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}