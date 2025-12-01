import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { productService } from "../../services/productService";
import { categoryService } from "../../services/categoryService";
import ProductCard from "../../components/product/ProductCard";
import { FiFilter, FiX, FiCheck } from "react-icons/fi";
// Import cấu hình bộ lọc
import { FILTER_OPTIONS } from "../../data/filterOptions";

export default function ProductList() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [showFilterMobile, setShowFilterMobile] = useState(false);
  const [categories, setCategories] = useState([]);

  // Lấy các tham số từ URL
  const categorySlug = params.get("categorySlug") || "all";
  const sort = params.get("sort") || "newest";
  const keyword = params.get("keyword") || "";
  const minPrice = params.get("minPrice") || "";
  const maxPrice = params.get("maxPrice") || "";

  // 1. Load danh mục động
  useEffect(() => {
    categoryService.getAll().then(data => {
        setCategories([{ name: "Tất cả", slug: "all" }, ...data]);
    }).catch(console.error);
  }, []);

  // 2. Load sản phẩm với bộ lọc
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Gom tất cả params hiện tại để gửi xuống API (bao gồm cả spec_...)
        const query = Object.fromEntries(params.entries());
        
        // Đảm bảo các tham số mặc định
        query.limit = 12;
        query.page = params.get("page") || 1;
        if (categorySlug === "all") delete query.categorySlug;

        const data = await productService.getAll(query);
        setProducts(data.products);
        setPagination({ page: data.page, pages: data.pages, total: data.total });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [params, categorySlug]); // Chạy lại khi params thay đổi

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(params);
    if (value && value !== "all") {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set("page", 1);
    setParams(newParams);
  };

  // Logic lọc giá
  const applyPriceFilter = (min, max) => {
    const newParams = new URLSearchParams(params);
    if (min !== null) newParams.set("minPrice", min); else newParams.delete("minPrice");
    if (max !== null) newParams.set("maxPrice", max); else newParams.delete("maxPrice");
    newParams.set("page", 1);
    setParams(newParams);
    setShowFilterMobile(false);
  };

  // Logic lọc Specs
  const toggleSpecFilter = (specKey, specValue) => {
      const paramKey = `spec_${specKey}`;
      const currentVal = params.get(paramKey);
      const newParams = new URLSearchParams(params);

      // Nếu đang chọn thì bỏ chọn, ngược lại thì chọn (chỉ hỗ trợ chọn 1 giá trị mỗi loại để đơn giản)
      if (currentVal === specValue) {
          newParams.delete(paramKey);
      } else {
          newParams.set(paramKey, specValue);
      }
      newParams.set("page", 1);
      setParams(newParams);
  };

  // Lấy danh sách bộ lọc tương ứng với Category hiện tại
  const currentFilters = FILTER_OPTIONS[categorySlug] || [];

  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container">
        {/* Header & Sort */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 bg-white p-3 rounded shadow-sm">
          <div>
            <h5 className="fw-bold mb-0">
              {keyword ? `Kết quả tìm kiếm: "${keyword}"` : "Danh sách sản phẩm"}
            </h5>
            <small className="text-muted">{pagination.total || 0} sản phẩm tìm thấy</small>
          </div>
          
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary d-md-none" onClick={() => setShowFilterMobile(true)}>
              <FiFilter /> Lọc
            </button>
            <select 
              className="form-select w-auto cursor-pointer" 
              value={sort} 
              onChange={(e) => updateFilter("sort", e.target.value)}
            >
              <option value="newest">Mới nhất</option>
              <option value="priceAsc">Giá tăng dần</option>
              <option value="priceDesc">Giá giảm dần</option>
              <option value="sold">Bán chạy nhất</option>
            </select>
          </div>
        </div>

        <div className="row g-4">
          {/* Sidebar Filter */}
          <div className={`col-md-3 ${showFilterMobile ? "fixed-filter show" : "d-none d-md-block"}`}>
            <div className="bg-white p-4 rounded shadow-sm sticky-top" style={{ top: 90, zIndex: 100 }}>
              <div className="d-flex justify-content-between align-items-center mb-3 d-md-none">
                <h5 className="fw-bold">Bộ lọc</h5>
                <button className="btn btn-sm btn-light" onClick={() => setShowFilterMobile(false)}><FiX size={20}/></button>
              </div>

              {/* 1. DANH MỤC */}
              <div className="mb-4">
                <h6 className="fw-bold mb-3 text-uppercase text-muted" style={{fontSize: 12}}>Danh mục</h6>
                <div className="d-flex flex-column gap-2">
                  {categories.map(cat => (
                    <label key={cat.slug} className="d-flex align-items-center gap-2 cursor-pointer product-filter-item">
                      <input 
                        type="radio" 
                        name="category" 
                        className="form-check-input mt-0"
                        checked={categorySlug === cat.slug}
                        onChange={() => {
                          // Reset toàn bộ filter khi đổi danh mục
                          const newP = new URLSearchParams();
                          newP.set("categorySlug", cat.slug);
                          setParams(newP);
                          setShowFilterMobile(false);
                        }}
                      />
                      <span className={categorySlug === cat.slug ? "fw-bold text-primary" : ""}>{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 2. GIÁ */}
              <div className="mb-4">
                <h6 className="fw-bold mb-3 text-uppercase text-muted" style={{fontSize: 12}}>Khoảng giá</h6>
                <div className="d-flex flex-column gap-2">
                  {[
                      { l: "Tất cả", min: null, max: null },
                      { l: "Dưới 10 triệu", min: null, max: 10000000 },
                      { l: "10 - 20 triệu", min: 10000000, max: 20000000 },
                      { l: "Trên 20 triệu", min: 20000000, max: null }
                  ].map((p, idx) => {
                      const isActive = String(params.get("minPrice")||"") === String(p.min||"") && String(params.get("maxPrice")||"") === String(p.max||"");
                      return (
                        <button key={idx} className={`btn btn-sm text-start ${isActive ? 'btn-primary' : 'btn-light bg-white border'}`} onClick={() => applyPriceFilter(p.min, p.max)}>
                            {p.l}
                        </button>
                      )
                  })}
                </div>
              </div>

              {/* 3. BỘ LỌC ĐỘNG THEO DANH MỤC (MỚI) */}
              {currentFilters.map((filter) => (
                  <div key={filter.key} className="mb-4">
                      <h6 className="fw-bold mb-2 text-uppercase text-muted" style={{fontSize: 12}}>{filter.label}</h6>
                      <div className="d-flex flex-wrap gap-2">
                          {filter.options.map(opt => {
                              const isChecked = params.get(`spec_${filter.key}`) === opt;
                              return (
                                  <button 
                                    key={opt}
                                    className={`btn btn-sm ${isChecked ? 'btn-primary' : 'btn-outline-secondary'}`}
                                    onClick={() => toggleSpecFilter(filter.key, opt)}
                                    style={{fontSize: 11}}
                                  >
                                      {opt} {isChecked && <FiCheck size={10} className="ms-1"/>}
                                  </button>
                              )
                          })}
                      </div>
                  </div>
              ))}
              
              <button className="btn btn-outline-danger w-100 btn-sm mt-2" onClick={() => setParams({})}>Xóa tất cả bộ lọc</button>
            </div>
            {showFilterMobile && <div className="filter-overlay" onClick={() => setShowFilterMobile(false)}></div>}
          </div>

          {/* Danh sách sản phẩm */}
          <div className="col-12 col-md-9">
            {loading ? (
              <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
            ) : products.length === 0 ? (
              <div className="text-center py-5 bg-white rounded shadow-sm">
                <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-state-2130362-1800926.png" alt="Empty" width="200" />
                <p className="text-muted mt-3">Không tìm thấy sản phẩm nào phù hợp.</p>
                <button className="btn btn-primary" onClick={() => setParams({})}>Xem tất cả sản phẩm</button>
              </div>
            ) : (
              <>
                <div className="row g-3">
                  {products.map((p) => (
                    <div key={p._id} className="col-6 col-lg-4">
                      <ProductCard product={p} />
                    </div>
                  ))}
                </div>

                {pagination.pages > 1 && (
                  <div className="d-flex justify-content-center mt-5 gap-2">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                      <button 
                        key={p} 
                        className={`btn ${Number(pagination.page) === p ? 'btn-primary' : 'btn-white border'}`}
                        onClick={() => updateFilter("page", p)}
                      >
                        {p}
                      </button>
                  ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      <style>{`
        .product-filter-item:hover { color: var(--primary); }
        @media (max-width: 768px) {
          .fixed-filter {
            position: fixed; top: 0; left: 0; bottom: 0; width: 280px;
            background: white; z-index: 1050; padding: 0; overflow-y: auto;
            transform: translateX(-100%); transition: 0.3s;
          }
          .fixed-filter.show { transform: translateX(0); }
          .filter-overlay {
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.5); z-index: 1040;
          }
        }
      `}</style>
    </div>
  );
}