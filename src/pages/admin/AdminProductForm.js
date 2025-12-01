import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { productService } from "../../services/productService";
import { categoryService } from "../../services/categoryService";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { getImageUrl } from "../../utils/constants";
import { FiTrash2, FiPlus, FiX, FiStar, FiCheck } from "react-icons/fi";
import { useNotification } from "../../context/NotificationContext";

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notify } = useNotification();
  
  const [form, setForm] = useState({ 
    name: "", slug: "", 
    price: 0,       // Giá bán
    importPrice: 0, // <--- MỚI: Giá gốc
    oldPrice: 0,    // Giá niêm yết (để hiện gạch ngang)
    stock: 0, 
    categorySlug: "", 
    brand: "", description: "", 
    images: [],
    thumbnail: "" 
  });

  const [categories, setCategories] = useState([]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [specsList, setSpecsList] = useState([{ key: "", value: "" }]);
  const [loading, setLoading] = useState(false);

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
            importPrice: data.importPrice || 0, // <--- Load giá gốc
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

  // Tự động tính giá bán khi thay đổi giá gốc (Tuỳ chọn logic, ở đây tôi để nhập tay độc lập)
  // Nhưng tự động tính giá bán khi đổi % giảm giá
  const handleDiscountChange = (e) => {
    let val = Number(e.target.value);
    if (val < 0) val = 0;
    if (val > 100) val = 100;
    
    setDiscountPercent(val);
    if (form.oldPrice > 0) {
        const newPrice = Math.round(form.oldPrice * (1 - val / 100));
        setForm(prev => ({ ...prev, price: newPrice }));
    }
  };

  const handleOldPriceChange = (e) => {
    const val = Number(e.target.value);
    setForm(prev => {
        const newPrice = discountPercent > 0 
            ? Math.round(val * (1 - discountPercent / 100)) 
            : val;
        return { ...prev, oldPrice: val, price: newPrice };
    });
  };

  const handlePriceChange = (e) => {
    const val = Number(e.target.value);
    setForm(prev => ({ ...prev, price: val }));
    // Tính ngược lại % giảm
    if (form.oldPrice > 0 && val <= form.oldPrice) {
        const percent = Math.round(((form.oldPrice - val) / form.oldPrice) * 100);
        setDiscountPercent(percent);
    } else {
        setDiscountPercent(0);
    }
  };

  // Upload ảnh
  const handleImage = async (e) => {
    const file = e.target.files[0];
    if(file) {
        try {
            const fd = new FormData();
            fd.append("image", file);
            const res = await productService.uploadImage(fd);
            const url = typeof res === 'object' ? res.url : res;
            
            if (url) {
                setForm(prev => {
                    const newImages = [url, ...prev.images];
                    const newThumb = prev.thumbnail ? prev.thumbnail : url;
                    return { ...prev, images: newImages, thumbnail: newThumb };
                });
                notify("Upload ảnh thành công", "success");
            } else {
                notify("Không nhận được link ảnh từ server", "error");
            }
        } catch (err) { 
            console.error(err);
            notify("Lỗi upload ảnh", "error"); 
        }
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
                
                {/* --- KHU VỰC GIÁ (ĐÃ SỬA ĐỂ THÊM GIÁ GỐC) --- */}
                <div className="col-12">
                    <div className="bg-light p-3 rounded border">
                        <label className="form-label fw-bold mb-2">Quản lý Giá & Lợi nhuận</label>
                        <div className="row g-3">
                            <div className="col-md-3">
                                <label className="form-label small text-muted">Giá nhập (Giá gốc)</label>
                                <input type="number" className="form-control border-warning" value={form.importPrice} onChange={e=>setForm({...form, importPrice: Number(e.target.value)})} min="0" placeholder="Để tính lãi"/>
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

                {/* --- KHU VỰC HÌNH ẢNH (GIỮ NGUYÊN TÍNH NĂNG CHỌN THUMBNAIL) --- */}
                <div className="col-12 mt-4"><h6 className="text-primary fw-bold border-bottom pb-2">2. Hình ảnh</h6></div>
                <div className="col-12">
                    <input type="file" className="form-control mb-3" onChange={handleImage} accept="image/*"/>
                    
                    <div className="d-flex gap-3 flex-wrap">
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