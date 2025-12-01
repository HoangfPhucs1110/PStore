import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { productService } from "../../services/productService";
import ProductCard from "../../components/product/ProductCard";
import TrendingSlider from "../../components/home/TrendingSlider";
import HomeCategorySection from "../../components/home/HomeCategorySection";
import { FiMonitor, FiHeadphones, FiGrid, FiMousePointer, FiArrowRight } from "react-icons/fi"; 
import api from "../../api/api";

const CATEGORIES = [
  { label: "Laptop", icon: <FiMonitor />, slug: "laptop" },
  { label: "Màn hình", icon: <FiMonitor />, slug: "man-hinh" },
  { label: "Bàn phím", icon: <FiGrid />, slug: "ban-phim" },
  { label: "Chuột", icon: <FiMousePointer />, slug: "chuot" },
  { label: "Tai nghe", icon: <FiHeadphones />, slug: "tai-nghe" },
];

const SECTIONS = [
    { title: "Laptop Gaming & Văn phòng", slug: "laptop" },
    { title: "Màn hình máy tính", slug: "man-hinh" },
    { title: "Bàn phím cơ", slug: "ban-phim" },
    { title: "Chuột Gaming", slug: "chuot" }
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [banners, setBanners] = useState([]);
  const [sectionData, setSectionData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [featRes, bannerRes, productsRes] = await Promise.all([
          productService.getAll({ isFeatured: true, limit: 8 }),
          api.get("/banners?position=hero").catch(() => ({ data: [] })),
          productService.getAll({ limit: 100 })
        ]);
        
        setFeatured(featRes.products);
        setBanners(bannerRes.data || []);

        const allProds = productsRes.products || [];
        const data = {};
        SECTIONS.forEach(sec => {
            data[sec.slug] = allProds.filter(p => p.categorySlug === sec.slug).slice(0, 8);
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

      {/* CATEGORY ICONS - ĐÃ SỬA: Bỏ bóng đổ (shadow-sm) */}
      <div className="container mb-5">
        <div className="d-flex justify-content-center gap-4 flex-wrap">
          {CATEGORIES.map(c => (
            <div 
                key={c.slug} 
                className="text-center cursor-pointer" 
                onClick={() => navigate(`/products?categorySlug=${c.slug}`)}
            >
              {/* Thay 'shadow-sm' bằng 'border' nhẹ hoặc bỏ hẳn nếu muốn phẳng lì */}
              <div 
                className="bg-white p-3 rounded-circle mb-2 text-primary d-flex align-items-center justify-content-center transition-transform hover-scale border" 
                style={{width: 70, height: 70, fontSize: 24}}
              >
                {c.icon}
              </div>
              <div className="fw-medium small text-muted">{c.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="container pb-5">
        {/* SẢN PHẨM NỔI BẬT */}
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

        {/* CÁC SECTION DANH MỤC */}
        {SECTIONS.map(sec => (
            <HomeCategorySection 
                key={sec.slug}
                title={sec.title}
                items={sectionData[sec.slug] || []}
                onViewAll={() => navigate(`/products?categorySlug=${sec.slug}`)}
            />
        ))}
      </div>
      
      <style>{`
        .hover-scale:hover { transform: translateY(-5px); border-color: var(--primary) !important; }
      `}</style>
    </div>
  );
}