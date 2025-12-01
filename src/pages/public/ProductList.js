import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { productService } from "../../services/productService";
import ProductCard from "../../components/product/ProductCard";
import { FiFilter, FiX } from "react-icons/fi";

const CATEGORIES = [
  { label: "Tất cả", value: "all" },
  { label: "Laptop Gaming", value: "laptop" },
  { label: "Màn hình", value: "man-hinh" },
  { label: "Bàn phím", value: "ban-phim" },
  { label: "Chuột", value: "chuot" },
  { label: "Tai nghe", value: "tai-nghe" },
  { label: "Ghế Gaming", value: "ghe-gaming" },
];

export default function ProductList() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [showFilterMobile, setShowFilterMobile] = useState(false);

  // State bộ lọc
  const categorySlug = params.get("categorySlug") || "all";
  const sort = params.get("sort") || "newest";
  const keyword = params.get("keyword") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Gom params lại để gửi API
        const query = { 
          categorySlug: categorySlug !== "all" ? categorySlug : undefined,
          sort,
          keyword,
          limit: 12,
          page: params.get("page") || 1
        };
        
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
  }, [params, categorySlug, sort, keyword]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(params);
    if (value && value !== "all") {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set("page", 1); // Reset về trang 1 khi lọc
    setParams(newParams);
  };

  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container">
        {/* Breadcrumb & Sort Header */}
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
          {/* Cột trái: Bộ lọc */}
          <div className={`col-md-3 ${showFilterMobile ? "fixed-filter show" : "d-none d-md-block"}`}>
            <div className="bg-white p-4 rounded shadow-sm sticky-top" style={{ top: 90, zIndex: 100 }}>
              <div className="d-flex justify-content-between align-items-center mb-3 d-md-none">
                <h5 className="fw-bold">Bộ lọc</h5>
                <button className="btn btn-sm btn-light" onClick={() => setShowFilterMobile(false)}><FiX size={20}/></button>
              </div>

              <div className="mb-4">
                <h6 className="fw-bold mb-3 text-uppercase text-muted" style={{fontSize: 12}}>Danh mục</h6>
                <div className="d-flex flex-column gap-2">
                  {CATEGORIES.map(cat => (
                    <label key={cat.value} className="d-flex align-items-center gap-2 cursor-pointer product-filter-item">
                      <input 
                        type="radio" 
                        name="category" 
                        className="form-check-input mt-0"
                        checked={categorySlug === cat.value}
                        onChange={() => {
                          updateFilter("categorySlug", cat.value);
                          setShowFilterMobile(false);
                        }}
                      />
                      <span className={categorySlug === cat.value ? "fw-bold text-primary" : ""}>{cat.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h6 className="fw-bold mb-3 text-uppercase text-muted" style={{fontSize: 12}}>Khoảng giá</h6>
                <div className="d-flex flex-column gap-2">
                  <button className="btn btn-sm btn-outline-light text-dark text-start" onClick={() => {/* Logic lọc giá custom */}}>Dưới 10 triệu</button>
                  <button className="btn btn-sm btn-outline-light text-dark text-start">10 - 20 triệu</button>
                  <button className="btn btn-sm btn-outline-light text-dark text-start">Trên 20 triệu</button>
                </div>
              </div>
              
              <button className="btn btn-outline-danger w-100 btn-sm" onClick={() => setParams({})}>Xóa bộ lọc</button>
            </div>
            {/* Overlay cho mobile */}
            {showFilterMobile && <div className="filter-overlay" onClick={() => setShowFilterMobile(false)}></div>}
          </div>

          {/* Cột phải: Danh sách sản phẩm */}
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

                {/* Phân trang */}
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
      
      {/* CSS Inline cho bộ lọc mobile */}
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