import { useState } from "react";
import { FiTrash2, FiEdit2, FiPlus } from "react-icons/fi";
import { useNotification } from "../../context/NotificationContext"; // [cite: 691, 692]

export default function ProfileAddresses({ addresses, onUpdate, saving }) {
  const { confirm, notify } = useNotification(); // [cite: 691, 692]
  const [editing, setEditing] = useState(null); // [cite: 692, 693]
  // Thêm trường _id (Nếu có từ DB) vào form để phân biệt khi chỉnh sửa
  const [form, setForm] = useState({ fullName: "", phone: "", address: "", isDefault: false, _id: null }); // FIX: Thêm _id
  
  const startEdit = (addr, index) => {
    setEditing(index); // [cite: 694]
    setForm(addr ? { ...addr, _id: addr._id } : { fullName: "", phone: "", address: "", isDefault: false, _id: null }); // [cite: 695]
  };
  
  // Thêm mới/Bắt đầu sửa
  const startAdd = () => {
    setEditing(-1); // -1 là thêm mới
    setForm({ fullName: "", phone: "", address: "", isDefault: false, _id: null });
  };
  
  const handleSave = async () => { // Đã chuyển thành async để chờ onUpdate
    if (!form.address.trim()) {
      notify("Vui lòng nhập địa chỉ chi tiết", "warning"); // [cite: 696]
      return; // [cite: 697]
    }
    
    let newList = [...addresses]; // [cite: 698]
    
    // Nếu đặt làm mặc định, bỏ mặc định của các cái khác
    if (form.isDefault) {
      newList = newList.map(a => ({ ...a, isDefault: false })); // [cite: 698, 699]
    }
    
    if (editing === -1) {
      // Thêm mới: dùng form data (loại bỏ _id giả nếu có)
      const { _id, ...newAddr } = form; 
      newList.push(newAddr); // [cite: 700]
    } else {
      // Cập nhật: tìm và thay thế
      // Cần tìm lại địa chỉ dựa trên _id thật (nếu có) hoặc index
      if (form._id) {
          const indexToUpdate = newList.findIndex(a => a._id === form._id);
          if(indexToUpdate !== -1) newList[indexToUpdate] = form;
      } else {
          // Trường hợp địa chỉ cũ chưa có _id (vừa được tạo), dùng index
          newList[editing] = form; // [cite: 701]
      }
    }
    
    // Gọi hàm cập nhật lên component cha (và server)
    const success = await onUpdate(newList); // onUpdate là handleSaveAddresses, hàm này trả về true/false
    
    if (success) {
        setEditing(null);
        notify("Địa chỉ đã được lưu!", "success");
    }
  };
  
  const handleDelete = (addrToDelete, index) => {
    // Dùng Custom Confirm thay cho window.confirm
    confirm("Bạn có chắc chắn muốn xóa địa chỉ này?", async () => { // [cite: 702]
      // Nếu địa chỉ có _id, dùng _id. Nếu không, dùng index
      const idToDelete = addrToDelete._id || index;
      const newList = addresses.filter(a => a._id ? a._id !== idToDelete : addresses.indexOf(a) !== idToDelete); // Lọc theo _id hoặc index
      
      const success = await onUpdate(newList);
      
      if (success) {
          notify("Đã xóa địa chỉ", "success"); // [cite: 702]
      } else {
          notify("Lỗi khi xóa địa chỉ", "error");
      }
    }); // [cite: 703]
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <h5 className="fw-bold m-0">Địa chỉ của tôi</h5>
        <button className="btn btn-primary btn-sm d-flex align-items-center gap-2" onClick={startAdd} disabled={editing !== null}>
          <FiPlus /> Thêm địa chỉ mới
        </button>
      </div>

      {editing !== null && (
        <div 
          className="card p-3 mb-4 bg-light border-0 shadow-sm animate-fade-in"> 
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
              <button type="button" className="btn btn-primary btn-sm px-4" onClick={handleSave} disabled={saving}>Lưu</button>
              <button type="button" className="btn btn-light btn-sm px-4" onClick={() => setEditing(null)}>Hủy</button>
            </div>
          </div>
        </div>
      )}

      <div className="vstack gap-3">
        {addresses.length === 0 && <p className="text-muted text-center py-3">Chưa có địa chỉ nào.</p>}
        {addresses.map((addr, i) => (
          <div key={addr._id || i} className="border rounded p-3 d-flex justify-content-between align-items-center bg-white">
            
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="fw-bold text-dark">{addr.fullName}</span>
                <span className="text-muted small border-start ps-2">{addr.phone}</span>
                {addr.isDefault && <span className="badge bg-success-subtle text-success border border-success-subtle">Mặc định</span>}
              </div>
              <div className="small text-secondary">{addr.address}</div>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-light btn-sm text-primary" onClick={() => startEdit(addr, i)} title="Sửa" disabled={saving}><FiEdit2 /></button>
              <button className="btn btn-light btn-sm text-danger" onClick={() => handleDelete(addr, i)} title="Xóa" disabled={saving}><FiTrash2 /></button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}