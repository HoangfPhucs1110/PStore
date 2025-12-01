import { useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { categoryService } from "../../services/categoryService";
import { productService } from "../../services/productService"; // Mượn hàm upload ảnh của product
import { useNotification } from "../../context/NotificationContext";
import { FiTrash2, FiEdit2, FiPlus, FiSave, FiX, FiUpload } from "react-icons/fi";
import { getImageUrl } from "../../utils/constants";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  
  // State Form
  const [form, setForm] = useState({ name: "", slug: "", sortOrder: 0, icon: "" }); // icon giờ sẽ lưu URL ảnh
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { notify, confirm } = useNotification();

  const loadCategories = () => {
    categoryService.getAll().then(setCategories).catch(console.error);
  };

  useEffect(() => { loadCategories(); }, []);

  // Tự động tạo slug
  const handleNameChange = (e) => {
    const val = e.target.value;
    if (!editingId) {
        const genSlug = val.toLowerCase()
          .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
          .replace(/đ/g, "d").replace(/[^a-z0-9\s-]/g, "")
          .trim().replace(/\s+/g, "-");
        setForm(prev => ({ ...prev, name: val, slug: genSlug }));
    } else {
        setForm(prev => ({ ...prev, name: val }));
    }
  };

  // Xử lý Upload Ảnh Danh mục
  const handleImage = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setUploading(true);
      try {
          const fd = new FormData();
          fd.append("image", file);
          // Tận dụng API upload của Product (vì backend dùng chung logic upload)
          const res = await productService.uploadImage(fd);
          const url = typeof res === 'object' ? res.url : res;
          
          setForm(prev => ({ ...prev, icon: url })); // Lưu URL vào trường icon
          notify("Upload ảnh thành công", "success");
      } catch (err) {
          notify("Lỗi upload ảnh", "error");
      } finally {
          setUploading(false);
      }
  };

  const handleEdit = (cat) => {
      setEditingId(cat._id);
      setForm({ 
          name: cat.name, 
          slug: cat.slug, 
          sortOrder: cat.sortOrder || 0,
          icon: cat.icon || "" 
      });
  }

  const handleCancel = () => {
      setEditingId(null);
      setForm({ name: "", slug: "", sortOrder: 0, icon: "" });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.slug) return notify("Vui lòng nhập tên và slug", "warning");

    try {
        if (editingId) {
            await categoryService.update(editingId, form);
            notify("Cập nhật thành công", "success");
        } else {
            await categoryService.create(form);
            notify("Thêm mới thành công", "success");
        }
        handleCancel();
        loadCategories();
    } catch (err) {
        notify(err.response?.data?.message || "Có lỗi xảy ra", "error");
    }
  };

  const handleDelete = (id) => {
    confirm("Xóa danh mục này?", async () => {
        try {
            await categoryService.delete(id);
            notify("Đã xóa danh mục", "success");
            loadCategories();
        } catch { notify("Lỗi xóa", "error"); }
    });
  };

  return (
    <div className="d-flex bg-light min-vh-100">
      <AdminSidebar />
      <div className="flex-grow-1 p-4">
        <h4 className="fw-bold mb-4">Quản lý Danh mục</h4>
        
        <div className="row g-4">
            {/* FORM */}
            <div className="col-md-4">
                <div className={`card border-0 shadow-sm p-3 ${editingId ? "border-primary border-2" : ""}`}>
                    <h6 className="fw-bold mb-3 text-primary">
                        {editingId ? "Cập nhật danh mục" : "Thêm danh mục mới"}
                    </h6>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label small">Tên danh mục</label>
                            <input className="form-control" value={form.name} onChange={handleNameChange} placeholder="Ví dụ: Laptop" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label small">Slug</label>
                            <input className="form-control" value={form.slug} onChange={e=>setForm({...form, slug: e.target.value})} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label small">Thứ tự</label>
                            <input type="number" className="form-control" value={form.sortOrder} onChange={e=>setForm({...form, sortOrder: e.target.value})} />
                        </div>

                        {/* UPLOAD ẢNH */}
                        <div className="mb-3">
                            <label className="form-label small">Ảnh đại diện</label>
                            <div className="d-flex align-items-center gap-3">
                                {form.icon ? (
                                    <div className="position-relative">
                                        <img src={getImageUrl(form.icon)} alt="" className="rounded border" width="60" height="60" style={{objectFit:"cover"}} />
                                        <button type="button" className="btn btn-sm btn-danger position-absolute top-0 start-100 translate-middle rounded-circle p-0" style={{width:20, height:20}} onClick={()=>setForm({...form, icon: ""})}>&times;</button>
                                    </div>
                                ) : (
                                    <div className="bg-light rounded border d-flex align-items-center justify-content-center text-muted small" style={{width: 60, height: 60}}>No IMG</div>
                                )}
                                <div>
                                    <label className="btn btn-sm btn-outline-primary mb-0">
                                        <FiUpload className="me-1"/> Chọn ảnh
                                        <input type="file" hidden onChange={handleImage} accept="image/*" />
                                    </label>
                                    {uploading && <span className="ms-2 small text-muted">Đang tải...</span>}
                                </div>
                            </div>
                        </div>
                        
                        <div className="d-flex gap-2">
                            <button className="btn btn-primary w-100 fw-bold" disabled={uploading}>
                                {editingId ? <><FiSave className="me-1"/> Lưu</> : <><FiPlus className="me-1"/> Thêm</>}
                            </button>
                            {editingId && <button type="button" className="btn btn-light" onClick={handleCancel}><FiX /></button>}
                        </div>
                    </form>
                </div>
            </div>

            {/* DANH SÁCH */}
            <div className="col-md-8">
                <div className="card border-0 shadow-sm">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="ps-4">#</th>
                                <th>Ảnh</th>
                                <th>Tên</th>
                                <th>Slug</th>
                                <th className="text-end pe-4">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map(cat => (
                                <tr key={cat._id} className={editingId === cat._id ? "table-active" : ""}>
                                    <td className="ps-4 fw-bold text-primary">{cat.sortOrder || 0}</td>
                                    <td>
                                        <img 
                                            src={getImageUrl(cat.icon)} 
                                            width="40" height="40" 
                                            className="rounded-circle border object-fit-cover" 
                                            alt=""
                                            onError={(e) => e.target.src = "https://placehold.co/40?text=IMG"}
                                        />
                                    </td>
                                    <td className="fw-medium">{cat.name}</td>
                                    <td className="text-muted">{cat.slug}</td>
                                    <td className="text-end pe-4">
                                        <button className="btn btn-light text-primary btn-sm me-2" onClick={() => handleEdit(cat)}><FiEdit2/></button>
                                        <button className="btn btn-light text-danger btn-sm" onClick={() => handleDelete(cat._id)}><FiTrash2/></button>
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