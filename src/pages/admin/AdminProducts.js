import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { productService } from "../../services/productService";
import { categoryService } from "../../services/categoryService"; // <--- Import Service Danh mục
import AdminSidebar from "../../components/admin/AdminSidebar";
import { FiEdit, FiTrash2, FiPlus, FiStar, FiSearch, FiFilter, FiRefreshCw } from "react-icons/fi";
import { getImageUrl } from "../../utils/constants";
import { useNotification } from "../../context/NotificationContext";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { confirm, notify } = useNotification();
  
  // State bộ lọc
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("all");
  const [categories, setCategories] = useState([]); // <--- State chứa danh mục động
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });

  // 1. Load danh mục động khi vào trang
  useEffect(() => {
    categoryService.getAll()
      .then(data => {
        // Thêm option "Tất cả" vào đầu danh sách
        setCategories([{ name: "Tất cả danh mục", slug: "all" }, ...data]);
      })
      .catch(console.error);
  }, []);

  // 2. Hàm load dữ liệu sản phẩm
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        limit: 10,
        page: pagination.page,
        keyword: keyword.trim(),
        categorySlug: category !== "all" ? category : undefined
      };
      
      const res = await productService.getAll(params);
      
      setProducts(res.products);
      setPagination(prev => ({ ...prev, total: res.total, pages: res.pages }));
    } catch (error) {
      console.error(error);
      notify("Lỗi tải danh sách sản phẩm", "error");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, keyword, category, notify]);

  useEffect(() => {
    load();
  }, [load]);

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    load();
  };

  const handleReset = () => {
    setKeyword("");
    setCategory("all");
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const toggleFeatured = async (product) => {
    try {
      await productService.update(product._id, { isFeatured: !product.isFeatured });
      setProducts(prev => prev.map(p => p._id === product._id ? { ...p, isFeatured: !product.isFeatured } : p));
      notify(`Đã ${!product.isFeatured ? "bật" : "tắt"} nổi bật`, "success");
    } catch (err) {
      notify("Lỗi cập nhật trạng thái", "error");
    }
  };

  const handleDelete = async (id) => {
    confirm("Bạn có chắc chắn muốn xóa sản phẩm này?", async () => {
      try {
        await productService.delete(id);
        notify("Đã xóa sản phẩm", "success");
        load();
      } catch (err) {
        notify("Xóa thất bại", "error");
      }
    });
  };

  return (
    <div className="d-flex bg-light min-vh-100">
      <AdminSidebar />
      <div className="flex-grow-1 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold m-0">Quản lý sản phẩm</h4>
          <Link to="/admin/products/new" className="btn btn-primary d-flex align-items-center gap-2">
            <FiPlus /> Thêm mới
          </Link>
        </div>

        {/* --- THANH CÔNG CỤ BỘ LỌC --- */}
        <div className="card border-0 shadow-sm mb-4 p-3">
            <form onSubmit={handleSearch} className="row g-3 align-items-center">
                <div className="col-md-4">
                    <div className="input-group">
                        <span className="input-group-text bg-white border-end-0"><FiSearch className="text-muted"/></span>
                        <input 
                            className="form-control border-start-0 ps-0" 
                            placeholder="Tìm tên, SKU..." 
                            value={keyword}
                            onChange={e => setKeyword(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="input-group">
                        <span className="input-group-text bg-white"><FiFilter className="text-muted"/></span>
                        
                        {/* SELECT DANH MỤC ĐỘNG */}
                        <select 
                            className="form-select" 
                            value={category} 
                            onChange={e => {
                                setCategory(e.target.value);
                                setPagination(prev => ({ ...prev, page: 1 }));
                            }}
                        >
                            {categories.map(c => (
                                <option key={c.slug} value={c.slug}>{c.name}</option>
                            ))}
                        </select>

                    </div>
                </div>
                <div className="col-md-3">
                    <button type="button" className="btn btn-light text-secondary border" onClick={handleReset}>
                        <FiRefreshCw className="me-2"/> Đặt lại
                    </button>
                </div>
                <div className="col-md-2 text-end text-muted small">
                    Tổng: <strong>{pagination.total}</strong>
                </div>
            </form>
        </div>

        {/* --- BẢNG SẢN PHẨM --- */}
        <div className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Sản phẩm</th>
                  <th>Giá bán</th>
                  <th className="text-center">Kho</th>
                  <th className="text-center">Nổi bật</th>
                  <th className="text-center">Trạng thái</th>
                  <th className="text-end pe-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-5">Đang tải dữ liệu...</td></tr>
                ) : products.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-5 text-muted">Không tìm thấy sản phẩm nào.</td></tr>
                ) : products.map(p => {
                  const discount = p.oldPrice > p.price 
                    ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) 
                    : 0;

                  return (
                    <tr key={p._id}>
                      <td className="ps-4">
                        <div className="d-flex align-items-center gap-3">
                          <div className="position-relative">
                            <img 
                              src={getImageUrl(p.thumbnail || p.images?.[0])} 
                              className="rounded border bg-white" 
                              width="48" height="48" 
                              style={{objectFit: "contain"}} 
                              alt=""
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://placehold.co/48?text=Err";
                              }}
                            />
                            {discount > 0 && (
                                <span className="position-absolute top-0 start-0 translate-middle badge rounded-pill bg-danger" style={{fontSize: 9}}>
                                    -{discount}%
                                </span>
                            )}
                          </div>
                          <div>
                            <div className="fw-medium text-dark">{p.name}</div>
                            <div className="text-muted small text-uppercase">{p.categorySlug}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="fw-bold text-primary">{p.price.toLocaleString()}đ</div>
                        {p.oldPrice > p.price && (
                            <small className="text-decoration-line-through text-muted">{p.oldPrice.toLocaleString()}đ</small>
                        )}
                      </td>
                      <td className="text-center">{p.stock}</td>
                      
                      <td className="text-center">
                          <button 
                              onClick={() => toggleFeatured(p)}
                              className={`btn btn-sm border-0 ${p.isFeatured ? "text-warning" : "text-muted opacity-25"}`}
                              title={p.isFeatured ? "Tắt nổi bật" : "Bật nổi bật"}
                          >
                              <FiStar size={20} fill={p.isFeatured ? "currentColor" : "none"} />
                          </button>
                      </td>

                      <td className="text-center">
                        <span className={`badge ${p.stock > 0 ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                          {p.stock > 0 ? 'Active' : 'Hết hàng'}
                        </span>
                      </td>
                      <td className="text-end pe-4">
                        <Link to={`/admin/products/${p._id}`} className="btn btn-light btn-sm text-primary me-2"><FiEdit /></Link>
                        <button onClick={() => handleDelete(p._id)} className="btn btn-light btn-sm text-danger"><FiTrash2 /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Phân trang */}
          {pagination.pages > 1 && (
            <div className="card-footer bg-white d-flex justify-content-end py-3">
              <nav>
                    <ul className="pagination pagination-sm mb-0">
                        <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setPagination(p => ({...p, page: p.page - 1}))}>&laquo;</button>
                        </li>
                        {[...Array(pagination.pages)].map((_, i) => (
                            <li key={i} className={`page-item ${pagination.page === i + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => setPagination(p => ({...p, page: i + 1}))}>
                                    {i + 1}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item ${pagination.page === pagination.pages ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setPagination(p => ({...p, page: p.page + 1}))}>&raquo;</button>
                        </li>
                    </ul>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}