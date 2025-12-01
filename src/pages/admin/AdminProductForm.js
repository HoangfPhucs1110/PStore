import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { productService } from "../../services/productService";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { getImageUrl } from "../../utils/constants";
import { FiTrash2, FiPlus, FiX } from "react-icons/fi";
import { useNotification } from "../../context/NotificationContext";

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notify } = useNotification();
  
  const [form, setForm] = useState({ 
    name: "", slug: "", 
    price: 0, 
    oldPrice: 0, 
    stock: 0, 
    categorySlug: "laptop", brand: "", description: "", 
    images: [] 
  });

  const [discountPercent, setDiscountPercent] = useState(0);
  const [specsList, setSpecsList] = useState([{ key: "", value: "" }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      productService.getById(id)
        .then(data => {
          setForm({
            name: data.name || "",
            slug: data.slug || "",
            price: data.price || 0,
            oldPrice: data.oldPrice || 0,
            stock: data.stock || 0,
            categorySlug: data.categorySlug || "laptop",
            brand: data.brand || "",
            description: data.description || "",
            images: data.images || []
          });

          // Tính % giảm giá khi load
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

  // --- LOGIC TÍNH GIÁ ĐÃ SỬA ---
  const handleOldPriceChange = (e) => {
    const val = Number(e.target.value);
    setForm(prev => {
        // Nếu chưa nhập giá bán hoặc giá bán đang bằng 0 -> Tự gán bằng giá gốc
        const newPrice = discountPercent > 0 
            ? Math.round(val * (1 - discountPercent / 100)) 
            : val;
        return { ...prev, oldPrice: val, price: newPrice };
    });
  };

  const handleDiscountChange = (e) => {
    let val = Number(e.target.value);
    if (val < 0) val = 0;
    if (val > 100) val = 100;
    
    setDiscountPercent(val);
    
    // Tự tính lại Giá bán
    if (form.oldPrice > 0) {
        const newPrice = Math.round(form.oldPrice * (1 - val / 100));
        setForm(prev => ({ ...prev, price: newPrice }));
    }
  };

  const handlePriceChange = (e) => {
    const val = Number(e.target.value);
    setForm(prev => ({ ...prev, price: val }));
    
    // Tự tính lại % giảm
    if (form.oldPrice > 0 && val <= form.oldPrice) {
        const percent = Math.round(((form.oldPrice - val) / form.oldPrice) * 100);
        setDiscountPercent(percent);
    } else {
        setDiscountPercent(0);
    }
  };

  // --- XỬ LÝ ẢNH ĐÃ SỬA ---
  const handleImage = async (e) => {
    const file = e.target.files[0];
    if(file) {
        try {
            const fd = new FormData(); fd.append("image", file);
            
            // Gọi API upload
            const res = await productService.uploadImage(fd);
            
            // Backend trả về: { url: "https://..." } hoặc chuỗi trực tiếp
            // Ta cần lấy đúng chuỗi URL
            const url = typeof res === 'object' ? res.url : res;

            if (url) {
                setForm(prev => ({...prev, images: [url, ...prev.images]}));
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

  const removeImage = (index) => setForm(prev => ({...prev, images: prev.images.filter((_, i) => i !== index)}));
  
  const handleSpecChange = (index, field, value) => { 
      const l = [...specsList]; 
      l[index][field] = value; 
      setSpecsList(l); 
  };
  const addSpecRow = () => setSpecsList([...specsList, { key: "", value: "" }]);
  const removeSpecRow = (index) => setSpecsList(specsList.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate cơ bản
    if (form.price <= 0) {
        notify("Giá bán phải lớn hơn 0", "warning");
        return;
    }

    const specsObject = {};
    specsList.forEach(item => {
        if (item.key.trim() && item.value.trim()) specsObject[item.key.trim()] = item.value.trim();
    });

    const payload = { ...form, specs: specsObject };

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
                        <label className="form-label fw-bold mb-2">Giá & Khuyến mãi</label>
                        <div className="row g-3">
                            <div className="col-md-4">
                                <label className="form-label small text-muted">Giá gốc</label>
                                <input type="number" className="form-control" value={form.oldPrice} onChange={handleOldPriceChange} min="0"/>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label small text-muted">Giảm (%)</label>
                                <input type="number" className="form-control text-danger fw-bold" value={discountPercent} onChange={handleDiscountChange} min="0" max="100"/>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label small text-muted">Giá bán (Bắt buộc)</label>
                                <input type="number" className="form-control fw-bold text-primary" value={form.price} onChange={handlePriceChange} required min="1"/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4"><label className="form-label">Tồn kho</label><input type="number" className="form-control" value={form.stock} onChange={e=>setForm({...form, stock: Number(e.target.value)})}/></div>
                <div className="col-md-4"><label className="form-label">Danh mục</label>
                    <select className="form-select" value={form.categorySlug} onChange={e=>setForm({...form, categorySlug: e.target.value})}>
                        <option value="laptop">Laptop</option><option value="man-hinh">Màn hình</option><option value="ban-phim">Bàn phím</option><option value="chuot">Chuột</option><option value="tai-nghe">Tai nghe</option><option value="ghe-gaming">Ghế Gaming</option>
                    </select>
                </div>
                <div className="col-md-4"><label className="form-label">Thương hiệu</label><input className="form-control" value={form.brand} onChange={e=>setForm({...form, brand: e.target.value})}/></div>
                <div className="col-12"><label className="form-label">Mô tả</label><textarea className="form-control" rows="3" value={form.description} onChange={e=>setForm({...form, description: e.target.value})}/></div>

                <div className="col-12 mt-4"><h6 className="text-primary fw-bold border-bottom pb-2">2. Hình ảnh</h6></div>
                <div className="col-12">
                    <input type="file" className="form-control mb-3" onChange={handleImage} accept="image/*"/>
                    <div className="d-flex gap-3 flex-wrap">
                        {form.images?.map((img, i) => (
                            <div key={i} className="position-relative border rounded p-1 bg-white" style={{width: 100, height: 100}}>
                                <img 
                                    src={getImageUrl(img)} 
                                    className="w-100 h-100 object-fit-contain rounded" 
                                    alt=""
                                    onError={(e) => e.target.src = "https://via.placeholder.com/100?text=Error"}
                                />
                                <button type="button" className="btn btn-danger btn-sm position-absolute top-0 end-0 translate-middle rounded-circle p-0 d-flex align-items-center justify-content-center" style={{width: 24, height: 24}} onClick={() => removeImage(i)}><FiX size={14}/></button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col-12 mt-4"><h6 className="text-primary fw-bold border-bottom pb-2">3. Thông số kỹ thuật</h6></div>
                <div className="col-12"><div className="bg-light p-3 rounded">{specsList.map((spec, index) => (<div key={index} className="row g-2 mb-2 align-items-center"><div className="col-md-4"><input className="form-control form-control-sm" placeholder="Tên thông số" value={spec.key} onChange={(e) => handleSpecChange(index, "key", e.target.value)}/></div><div className="col-md-7"><input className="form-control form-control-sm" placeholder="Giá trị" value={spec.value} onChange={(e) => handleSpecChange(index, "value", e.target.value)}/></div><div className="col-md-1 text-center"><button type="button" className="btn btn-sm text-danger" onClick={() => removeSpecRow(index)}><FiTrash2 /></button></div></div>))}<button type="button" className="btn btn-sm btn-outline-primary mt-2" onClick={addSpecRow}><FiPlus /> Thêm thông số</button></div></div>

                <div className="col-12 mt-4 pt-3 border-top d-flex gap-3"><button className="btn btn-primary px-4 fw-bold">LƯU SẢN PHẨM</button><button type="button" className="btn btn-light px-4" onClick={() => navigate("/admin/products")}>Hủy</button></div>
            </div>
        </form>
      </div>
    </div>
  );
}