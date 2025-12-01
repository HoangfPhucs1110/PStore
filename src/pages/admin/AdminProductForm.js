import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { productService } from "../../services/productService";
import { categoryService } from "../../services/categoryService";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { getImageUrl } from "../../utils/constants";
import { FiTrash2, FiPlus, FiX, FiStar, FiCheck, FiUploadCloud } from "react-icons/fi";
import { useNotification } from "../../context/NotificationContext";

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notify } = useNotification();
  
  const [form, setForm] = useState({ 
    name: "", slug: "", 
    price: 0, importPrice: 0, oldPrice: 0, stock: 0, 
    categorySlug: "", brand: "", description: "", 
    images: [], thumbnail: "" 
  });

  const [categories, setCategories] = useState([]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [specsList, setSpecsList] = useState([{ key: "", value: "" }]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false); // State để hiện loading khi upload

  useEffect(() => {
    categoryService.getAll().then(setCategories).catch(err => console.error("Lỗi load danh mục:", err));

    if (id) {
      setLoading(true);
      productService.getById(id)
        .then(data => {
          setForm({
            name: data.name || "",
            slug: data.slug || "",
            price: data.price || 0,
            importPrice: data.importPrice || 0,
            oldPrice: data.oldPrice || 0,
            stock: data.stock || 0,
            categorySlug: data.categorySlug || "",
            brand: data.brand || "",
            description: data.description || "",
            images: data.images || [],
            thumbnail: data.thumbnail || (data.images?.[0] || "") 
          });

          if (data.oldPrice > data.price) {
            setDiscountPercent(Math.round(((data.oldPrice - data.price) / data.oldPrice) * 100));
          } else {
            setDiscountPercent(0);
          }

          if (data.specs) {
            setSpecsList(Object.entries(data.specs).map(([k, v]) => ({ key: k, value: v })));
          }
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  // --- CÁC HÀM XỬ LÝ GIÁ (GIỮ NGUYÊN) ---
  const handleDiscountChange = (e) => {
    let val = Number(e.target.value);
    if (val < 0) val = 0; if (val > 100) val = 100;
    setDiscountPercent(val);
    if (form.oldPrice > 0) {
        const newPrice = Math.round(form.oldPrice * (1 - val / 100));
        setForm(prev => ({ ...prev, price: newPrice }));
    }
  };
  const handleOldPriceChange = (e) => {
    const val = Number(e.target.value);
    setForm(prev => {
        const newPrice = discountPercent > 0 ? Math.round(val * (1 - discountPercent / 100)) : val;
        return { ...prev, oldPrice: val, price: newPrice };
    });
  };
  const handlePriceChange = (e) => {
    const val = Number(e.target.value);
    setForm(prev => ({ ...prev, price: val }));
    if (form.oldPrice > 0 && val <= form.oldPrice) {
        const percent = Math.round(((form.oldPrice - val) / form.oldPrice) * 100);
        setDiscountPercent(percent);
    } else {
        setDiscountPercent(0);
    }
  };

  // --- XỬ LÝ UPLOAD NHIỀU ẢNH (MỚI) ---
  const handleImage = async (e) => {
    const files = Array.from(e.target.files); // Chuyển FileList sang Array
    if (files.length === 0) return;

    setUploading(true);
    try {
        // Tạo các Promise upload song song
        const uploadPromises = files.map(async (file) => {
            const fd = new FormData();
            fd.append("image", file);
            const res = await productService.uploadImage(fd);
            return typeof res === 'object' ? res.url : res;
        });

        // Chờ tất cả ảnh upload xong
        const uploadedUrls = await Promise.all(uploadPromises);
        
        // Lọc bỏ các url lỗi (nếu có)
        const validUrls = uploadedUrls.filter(url => url);

        if (validUrls.length > 0) {
            setForm(prev => {
                const newImages = [...validUrls, ...prev.images]; // Thêm ảnh mới vào đầu
                // Nếu chưa có thumbnail, lấy ảnh đầu tiên vừa up làm thumbnail
                const newThumb = prev.thumbnail ? prev.thumbnail : newImages[0];
                return { ...prev, images: newImages, thumbnail: newThumb };
            });
            notify(`Đã tải lên ${validUrls.length} ảnh thành công`, "success");
        }
    } catch (err) { 
        console.error(err);
        notify("Lỗi upload ảnh", "error"); 
    } finally {
        setUploading(false);
        e.target.value = ""; // Reset input để chọn lại được ảnh cũ nếu muốn
    }
  }

  const removeImage = (index) => {
    setForm(prev => {
        const imageToRemove = prev.images[index];
        const newImages = prev.images.filter((_, i) => i !== index);
        let newThumb = prev.thumbnail;
        if (imageToRemove === prev.thumbnail) {
            newThumb = newImages.length > 0 ? newImages[0] : "";
        }
        return { ...prev, images: newImages, thumbnail: newThumb };
    });
  };

  const setThumbnail = (url) => {
      setForm(prev => ({ ...prev, thumbnail: url }));
      notify("Đã chọn ảnh đại diện", "success");
  };

  // --- XỬ LÝ SPECS (GIỮ NGUYÊN) ---
  const handleSpecChange = (index, field, value) => { 
      const l = [...specsList];
      l[index][field] = value; 
      setSpecsList(l); 
  };
  const addSpecRow = () => setSpecsList([...specsList, { key: "", value: "" }]);
  const removeSpecRow = (index) => setSpecsList(specsList.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.price <= 0) return notify("Giá bán phải lớn hơn 0", "warning");
    if (form.importPrice > form.price) notify("Cảnh báo: Giá nhập đang cao hơn giá bán!", "warning");

    const specsObject = {};
    specsList.forEach(item => {
        if (item.key.trim() && item.value.trim()) specsObject[item.key.trim()] = item.value.trim();
    });
    
    let finalThumbnail = form.thumbnail;
    if (!finalThumbnail && form.images.length > 0) finalThumbnail = form.images[0];

    const payload = { ...form, thumbnail: finalThumbnail, specs: specsObject };

    try {
        if (id) await productService.update(id, payload);
        else await productService.create(payload);
        
        notify(id ? "Cập nhật thành công!" : "Thêm mới thành công!", "success");
        navigate("/admin/products");
    } catch (err) { 
        console.error(err);
        notify(err.response?.data?.message || "Lỗi lưu sản phẩm", "error");
    }
  };

  if (loading) return <div className="p-5 text-center">Đang tải...</div>;

  return (
    <div className="d-flex bg-light min-vh-100">
      <AdminSidebar />
      <div className="flex-grow-1 p-4">
        <h4 className="fw-bold mb-4">{id ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}</h4>
        <form onSubmit={handleSubmit} className="card border-0 shadow-sm p-4">
            <div className="row g-3">
                <div className="col-12"><h6 className="text-primary fw-bold border-bottom pb-2">1. Thông tin chung</h6></div>
                
                <div className="col-md-6"><label className="form-label">Tên sản phẩm</label><input className="form-control" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} required/></div>
                <div className="col-md-6"><label className="form-label">Slug</label><input className="form-control" value={form.slug} onChange={e=>setForm({...form, slug: e.target.value})} required/></div>
                
                <div className="col-12">
                    <div className="bg-light p-3 rounded border">
                        <label className="form-label fw-bold mb-2">Quản lý Giá & Lợi nhuận</label>
                        <div className="row g-3">
                            <div className="col-md-3">
                                <label className="form-label small text-muted">Giá nhập (Giá gốc)</label>
                                <input type="number" className="form-control border-warning" value={form.importPrice} onChange={e=>setForm({...form, importPrice: Number(e.target.value)})} min="0"/>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label small text-muted">Giá niêm yết (Giá cũ)</label>
                                <input type="number" className="form-control" value={form.oldPrice} onChange={handleOldPriceChange} min="0"/>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label small text-muted">Giảm giá (%)</label>
                                <input type="number" className="form-control text-danger fw-bold" value={discountPercent} onChange={handleDiscountChange} min="0" max="100"/>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label small text-muted">Giá bán thực tế <span className="text-danger">*</span></label>
                                <input type="number" className="form-control fw-bold text-primary" value={form.price} onChange={handlePriceChange} required min="1"/>
                            </div>
                            <div className="col-12">
                                <small className="text-muted fst-italic">
                                    Lợi nhuận dự kiến: <span className="fw-bold text-success">{(form.price - form.importPrice).toLocaleString()}đ</span> / sản phẩm
                                </small>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4"><label className="form-label">Tồn kho</label><input type="number" className="form-control" value={form.stock} onChange={e=>setForm({...form, stock: Number(e.target.value)})}/></div>
                
                <div className="col-md-4">
                    <label className="form-label">Danh mục</label>
                    <select className="form-select" value={form.categorySlug} onChange={e=>setForm({...form, categorySlug: e.target.value})}>
                        <option value="">-- Chọn danh mục --</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat.slug}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <div className="col-md-4"><label className="form-label">Thương hiệu</label><input className="form-control" value={form.brand} onChange={e=>setForm({...form, brand: e.target.value})}/></div>
                <div className="col-12"><label className="form-label">Mô tả</label><textarea className="form-control" rows="3" value={form.description} onChange={e=>setForm({...form, description: e.target.value})}/></div>

                {/* --- KHU VỰC HÌNH ẢNH (ĐÃ CẬP NHẬT MULTIPLE UPLOAD) --- */}
                <div className="col-12 mt-4"><h6 className="text-primary fw-bold border-bottom pb-2">2. Hình ảnh</h6></div>
                <div className="col-12">
                    <div className="mb-3">
                        <label className="btn btn-outline-primary d-inline-flex align-items-center gap-2">
                            {uploading ? <span className="spinner-border spinner-border-sm"/> : <FiUploadCloud size={20}/>}
                            <span>{uploading ? "Đang tải lên..." : "Chọn nhiều ảnh"}</span>
                            {/* Thêm thuộc tính multiple */}
                            <input type="file" className="d-none" onChange={handleImage} accept="image/*" multiple disabled={uploading}/>
                        </label>
                        <span className="ms-3 text-muted small">Giữ phím <strong>Ctrl</strong> (hoặc Command) để chọn nhiều ảnh cùng lúc.</span>
                    </div>
                    
                    <div className="d-flex gap-3 flex-wrap bg-light p-3 rounded border border-dashed">
                        {form.images.length === 0 && <div className="text-muted w-100 text-center py-4">Chưa có ảnh nào.</div>}
                        {form.images?.map((img, i) => {
                            const isThumbnail = img === form.thumbnail;
                            return (
                                <div key={i} className={`position-relative border rounded p-1 bg-white ${isThumbnail ? 'border-primary border-2 shadow-sm' : ''}`} style={{width: 120, height: 120}}>
                                    <img src={getImageUrl(img)} className="w-100 h-100 object-fit-contain rounded" alt="" onError={(e) => e.target.src = "https://via.placeholder.com/100?text=Error"}/>
                                    
                                    <button type="button" className="btn btn-danger btn-sm position-absolute top-0 end-0 translate-middle rounded-circle p-0 d-flex align-items-center justify-content-center shadow-sm" style={{width: 24, height: 24, zIndex: 10}} onClick={() => removeImage(i)}>
                                        <FiX size={14}/>
                                    </button>

                                    <button type="button" className={`btn btn-sm position-absolute bottom-0 start-0 m-1 rounded-circle p-1 d-flex align-items-center justify-content-center shadow-sm ${isThumbnail ? 'btn-warning text-white' : 'btn-light text-secondary'}`} style={{width: 28, height: 28, zIndex: 5}} onClick={() => setThumbnail(img)} title={isThumbnail ? "Ảnh đại diện hiện tại" : "Đặt làm ảnh đại diện"}>
                                        {isThumbnail ? <FiCheck size={16}/> : <FiStar size={16}/>}
                                    </button>

                                    {isThumbnail && <span className="position-absolute top-0 start-0 badge bg-primary m-1" style={{fontSize: 9}}>Main</span>}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="col-12 mt-4"><h6 className="text-primary fw-bold border-bottom pb-2">3. Thông số kỹ thuật</h6></div>
                <div className="col-12">
                    <div className="bg-light p-3 rounded">
                        {specsList.map((spec, index) => (
                            <div key={index} className="row g-2 mb-2 align-items-center">
                                <div className="col-md-4"><input className="form-control form-control-sm" placeholder="Tên thông số" value={spec.key} onChange={(e) => handleSpecChange(index, "key", e.target.value)}/></div>
                                <div className="col-md-7"><input className="form-control form-control-sm" placeholder="Giá trị" value={spec.value} onChange={(e) => handleSpecChange(index, "value", e.target.value)}/></div>
                                <div className="col-md-1 text-center"><button type="button" className="btn btn-sm text-danger" onClick={() => removeSpecRow(index)}><FiTrash2 /></button></div>
                            </div>
                        ))}
                        <button type="button" className="btn btn-sm btn-outline-primary mt-2" onClick={addSpecRow}><FiPlus /> Thêm thông số</button>
                    </div>
                </div>

                <div className="col-12 mt-4 pt-3 border-top d-flex gap-3">
                    <button className="btn btn-primary px-4 fw-bold">LƯU SẢN PHẨM</button>
                    <button type="button" className="btn btn-light px-4" onClick={() => navigate("/admin/products")}>Hủy</button>
                </div>
            </div>
        </form>
      </div>
    </div>
  );
}