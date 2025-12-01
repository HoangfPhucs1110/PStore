import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { productService } from "../../services/productService";
import { categoryService } from "../../services/categoryService";
import ProductCard from "../../components/product/ProductCard";
import HomeCategorySection from "../../components/home/HomeCategorySection";
import { FiArrowRight } from "react-icons/fi"; 
import api from "../../api/api";
import { getImageUrl } from "../../utils/constants"; // <--- Import để lấy link ảnh chuẩn

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sectionData, setSectionData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [featRes, catRes, productsRes] = await Promise.all([
          productService.getAll({ isFeatured: true, limit: 8 }),
          categoryService.getAll().catch(() => []),
          productService.getAll({ limit: 100 })
        ]);
       
        setFeatured(featRes.products);
        setCategories(catRes || []);

        const allProds = productsRes.products || [];
        const data = {};
        
        (catRes || []).slice(0, 4).forEach(cat => {
            data[cat.slug] = allProds.filter(p => p.categorySlug === cat.slug).slice(0, 8);
        });
        setSectionData(data);

      } catch (err) { console.error(err); }
    };
    loadData();
  }, []);

  return (
    <div className="bg-light pb-5">
      {/* HERO SECTION */}
      <div className="bg-dark text-white py-5 mb-5" style={{background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"}}>
        <div className="container py-4">
          <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0">
              <span className="badge bg-warning text-dark mb-3 px-3 py-2 rounded-pill">Khuyến mãi hè 2025</span>
              <h1 className="display-4 fw-bold mb-3">Nâng Tầm Trải Nghiệm Gaming</h1>
              <p className="lead mb-4 text-white-50">Sở hữu những thiết bị công nghệ đỉnh cao với mức giá không thể tốt hơn tại PStore.</p>
              <button className="btn btn-light text-primary fw-bold px-4 py-3 rounded-pill shadow" onClick={() => navigate("/products")}>Mua sắm ngay</button>
            </div>
            <div className="col-md-6 text-center">
               <img 
                 src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=1000&auto=format&fit=crop"
                 alt="Hero" 
                 className="img-fluid rounded-4 shadow-lg" 
                 style={{maxHeight: 400, objectFit: 'cover', width: '100%'}} 
               />
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORIES - HIỂN THỊ ẢNH THẬT */}
      <div className="container mb-5">
        <h4 className="fw-bold mb-4 text-center">Danh mục sản phẩm</h4>
        <div className="d-flex justify-content-center gap-4 flex-wrap">
          {categories.map(c => (
            <div 
                key={c._id} 
                className="text-center cursor-pointer group" 
                onClick={() => navigate(`/products?categorySlug=${c.slug}`)}
                style={{width: 100}}
            >
              <div 
                className="bg-white rounded-circle mb-2 d-flex align-items-center justify-content-center transition-transform hover-scale border mx-auto shadow-sm" 
                style={{width: 80, height: 80, overflow: "hidden"}}
              >
                {/* Dùng thẻ IMG để hiện ảnh upload */}
                <img 
                    src={getImageUrl(c.icon)} 
                    alt={c.name}
                    style={{width: "100%", height: "100%", objectFit: "cover"}}
                    onError={(e) => e.target.src = "https://placehold.co/80?text=Category"}
                />
              </div>
              <div className="fw-bold small text-dark mt-2">{c.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTIONS */}
      <div className="container pb-5">
        <div className="mb-5">
            <div className="d-flex justify-content-between align-items-center mb-3 px-1">
                <h3 className="fw-bold m-0 text-dark">Sản Phẩm Nổi Bật</h3>
                <button className="btn btn-link text-dark text-decoration-none fw-medium p-0 d-flex align-items-center gap-1" onClick={() => navigate("/products")}>
                    Xem tất cả <FiArrowRight />
                </button>
            </div>
            <div className="row g-4">
                {featured.map(p => (
                <div key={p._id} className="col-6 col-md-4 col-lg-3">
                    <ProductCard product={p} />
                </div>
              ))}
            </div>
        </div>

        {categories.slice(0, 4).map(cat => (
            sectionData[cat.slug] && sectionData[cat.slug].length > 0 && (
                <HomeCategorySection 
                    key={cat._id}
                    title={cat.name} 
                    items={sectionData[cat.slug] || []}
                    onViewAll={() => navigate(`/products?categorySlug=${cat.slug}`)}
                />
            )
        ))}
      </div>
      
      <style>{`
        .hover-scale:hover { transform: translateY(-5px); border-color: var(--primary) !important; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
      `}</style>
    </div>
  );
}