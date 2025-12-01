import { useState } from "react";
import { FiTrash2, FiEdit2, FiPlus } from "react-icons/fi";
import { useNotification } from "../../context/NotificationContext"; // Import hook thông báo

export default function ProfileAddresses({ addresses, onUpdate, saving }) {
  const { confirm, notify } = useNotification(); // Sử dụng hook
  const [editing, setEditing] = useState(null); // index đang sửa, -1 là thêm mới
  const [form, setForm] = useState({ fullName: "", phone: "", address: "", isDefault: false });

  const startEdit = (addr, index) => {
    setEditing(index);
    setForm(addr ? { ...addr } : { fullName: "", phone: "", address: "", isDefault: false });
  };

  const handleSave = () => {
    if (!form.address.trim()) {
      notify("Vui lòng nhập địa chỉ chi tiết", "warning");
      return;
    }
    
    let newList = [...addresses];
    
    // Nếu đặt làm mặc định, bỏ mặc định của các cái khác
    if (form.isDefault) {
      newList = newList.map(a => ({ ...a, isDefault: false }));
    }

    if (editing === -1) {
      newList.push(form); // Thêm mới
    } else {
      newList[editing] = form; // Cập nhật
    }
    
    onUpdate(newList);
    setEditing(null);
  };

  const handleDelete = (index) => {
    // Dùng Custom Confirm thay cho window.confirm
    confirm("Bạn có chắc chắn muốn xóa địa chỉ này?", () => {
      const newList = addresses.filter((_, i) => i !== index);
      onUpdate(newList);
      notify("Đã xóa địa chỉ", "success");
    });
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <h5 className="fw-bold m-0">Địa chỉ của tôi</h5>
        <button className="btn btn-primary btn-sm d-flex align-items-center gap-2" onClick={() => startEdit(null, -1)} disabled={editing !== null}>
          <FiPlus /> Thêm địa chỉ mới
        </button>
      </div>

      {editing !== null && (
        <div className="card p-3 mb-4 bg-light border-0 shadow-sm animate-fade-in">
          <h6 className="fw-bold mb-3">{editing === -1 ? "Thêm địa chỉ mới" : "Cập nhật địa chỉ"}</h6>
          <div className="row g-2">
            <div className="col-md-6">
              <label className="form-label small text-muted">Họ tên</label>
              <input className="form-control" value={form.fullName} onChange={e=>setForm({...form, fullName: e.target.value})} />
            </div>
            <div className="col-md-6">
              <label className="form-label small text-muted">Số điện thoại</label>
              <input className="form-control" value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} />
            </div>
            <div className="col-12">
              <label className="form-label small text-muted">Địa chỉ chi tiết</label>
              <input className="form-control" placeholder="Số nhà, đường, phường/xã..." value={form.address} onChange={e=>setForm({...form, address: e.target.value})} />
            </div>
            <div className="col-12">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="defaultAddr" checked={form.isDefault} onChange={e=>setForm({...form, isDefault: e.target.checked})} />
                <label className="form-check-label" htmlFor="defaultAddr">Đặt làm địa chỉ mặc định</label>
              </div>
            </div>
            <div className="col-12 mt-3 d-flex gap-2">
              <button className="btn btn-primary btn-sm px-4" onClick={handleSave} disabled={saving}>Lưu</button>
              <button className="btn btn-light btn-sm px-4" onClick={() => setEditing(null)}>Hủy</button>
            </div>
          </div>
        </div>
      )}

      <div className="vstack gap-3">
        {addresses.length === 0 && <p className="text-muted text-center py-3">Chưa có địa chỉ nào.</p>}
        {addresses.map((addr, i) => (
          <div key={i} className="border rounded p-3 d-flex justify-content-between align-items-center bg-white">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="fw-bold text-dark">{addr.fullName}</span>
                <span className="text-muted small border-start ps-2">{addr.phone}</span>
                {addr.isDefault && <span className="badge bg-success-subtle text-success border border-success-subtle">Mặc định</span>}
              </div>
              <div className="small text-secondary">{addr.address}</div>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-light btn-sm text-primary" onClick={() => startEdit(addr, i)} title="Sửa"><FiEdit2 /></button>
              <button className="btn btn-light btn-sm text-danger" onClick={() => handleDelete(i)} title="Xóa"><FiTrash2 /></button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}