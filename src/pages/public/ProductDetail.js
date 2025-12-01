import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { productService } from "../../services/productService";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import ProductImageGallery from "../../components/product/ProductImageGallery";
import ProductReviews from "../../components/product/ProductReviews";
import TrendingSlider from "../../components/home/TrendingSlider";
import api from "../../api/api";
import { FiHeart, FiShoppingCart, FiClock } from "react-icons/fi";
import { Helmet, HelmetProvider } from 'react-helmet-async';

// --- TỪ ĐIỂN THÔNG SỐ (Cập nhật đầy đủ tiếng Việt) ---
const SPEC_DICT = {
  // Laptop / PC
  cpu: "Vi xử lý (CPU)",
  ram: "Bộ nhớ RAM",
  storage: "Ổ cứng",
  ssd: "Ổ cứng (SSD)",
  hdd: "Ổ cứng (HDD)",
  vga: "Card đồ họa",
  gpu: "Card đồ họa",
  display: "Màn hình",
  screen: "Màn hình",
  "màn hình": "Màn hình",
  os: "Hệ điều hành",
  weight: "Trọng lượng",
  battery: "Pin",
  ports: "Cổng kết nối",
  
  // Màn hình
  size: "Kích thước",
  resolution: "Độ phân giải",
  "độ phân giải": "Độ phân giải",
  panel: "Tấm nền",
  "tấm nền": "Tấm nền",
  refreshRate: "Tần số quét",
  "tần số quét": "Tần số quét",
  responseTime: "Phản hồi",
  
  // Gear
  connection: "Kết nối",
  "kết nối": "Kết nối",
  led: "Đèn LED",
  switch: "Loại Switch",
  keycap: "Keycap",
  layout: "Layout phím",
  dpi: "Độ nhạy (DPI)",
  sensor: "Cảm biến",
  color: "Màu sắc",
  driver: "Driver (Củ loa)",
  mic: "Microphone",
  
  // Ghế
  material: "Chất liệu",
  "chất liệu": "Chất liệu",
  "tải trọng": "Tải trọng tối đa",
  "ngả lưng": "Góc ngả lưng",
  "trụ thủy lực": "Piston thủy lực",

  // Chung
  brand: "Thương hiệu",
  warranty: "Bảo hành",
  origin: "Xuất xứ"
};

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [inWishlist, setInWishlist] = useState(false);
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await productService.getBySlug(slug);
        setProduct(data);

        // --- LƯU LỊCH SỬ XEM ---
        let viewed = JSON.parse(localStorage.getItem("pstore_viewed") || "[]");
        viewed = viewed.filter(p => p._id !== data._id);
        viewed.unshift({ 
            _id: data._id, 
            name: data.name, 
            thumbnail: data.thumbnail || data.images?.[0],
            price: data.price, 
            slug: data.slug 
        });
        if (viewed.length > 10) viewed.pop();
        localStorage.setItem("pstore_viewed", JSON.stringify(viewed));
        
        setRecentProducts(viewed.filter(p => p._id !== data._id));

        if (data.categorySlug) {
          const res = await productService.getAll({ categorySlug: data.categorySlug, limit: 12 });
          setRelatedProducts((res.products || []).filter(p => p._id !== data._id));
        }

        if (user) {
          try {
            const wRes = await api.get("/wishlists");
            setInWishlist((wRes.data?.productIds || []).includes(data._id));
          } catch (e) {}
        }
      } catch (err) {
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [slug, navigate, user]);

  const handleBuyNow = () => {
    addToCart(product, qty);
    navigate("/checkout");
  };

  const toggleWishlist = async () => {
    if (!user) return navigate("/login");
    try {
      await api.post("/wishlists/toggle", { productId: product._id });
      setInWishlist(!inWishlist);
    } catch (err) { alert("Lỗi cập nhật yêu thích"); }
  };

  if (loading || !product) return <div className="container py-5 text-center"><div className="spinner-border text-primary"></div></div>;

  const images = [product.thumbnail, ...(product.images || [])].filter(Boolean);

  return (
    <HelmetProvider>
        <div className="bg-light py-4">
        <Helmet>
            <title>{product.name} | PStore</title>
            <meta name="description" content={product.shortDescription || `Mua ${product.name} chính hãng tại PStore.`} />
        </Helmet>

        <div className="container">
            <div className="small text-muted mb-3">Trang chủ / Sản phẩm / {product.name}</div>

            <div className="row g-4">
            <div className="col-lg-5">
                <div className="bg-white p-3 rounded-3 shadow-sm sticky-top" style={{top: 90}}>
                <ProductImageGallery images={images} />
                </div>
            </div>

            <div className="col-lg-7">
                <div className="bg-white p-4 rounded-3 shadow-sm h-100">
                <h3 className="fw-bold mb-2 text-dark">{product.name}</h3>
                <div className="d-flex align-items-center gap-3 mb-3 text-muted small">
                    <span>Thương hiệu: <strong className="text-primary">{product.brand}</strong></span>
                    <span>|</span>
                    <span>SKU: {product.sku}</span>
                    <span>|</span>
                    <span className={product.stock > 0 ? "text-success fw-bold" : "text-danger fw-bold"}>
                    {product.stock > 0 ? "Còn hàng" : "Hết hàng"}
                    </span>
                </div>
                
                <div className="p-3 bg-light rounded-3 mb-4 border-start border-4 border-danger">
                    <div className="d-flex align-items-end gap-3">
                    <span className="display-6 fw-bold text-danger">{product.price.toLocaleString()}đ</span>
                    {product.oldPrice > product.price && (
                        <span className="text-muted text-decoration-line-through fs-5 mb-2">{product.oldPrice.toLocaleString()}đ</span>
                    )}
                    </div>
                </div>

                <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="input-group" style={{width: 140}}>
                    <button className="btn btn-outline-secondary" onClick={()=>setQty(q=>Math.max(1, q-1))}>-</button>
                    <input className="form-control text-center bg-white" readOnly value={qty} />
                    <button className="btn btn-outline-secondary" onClick={()=>setQty(q=>q+1)}>+</button>
                    </div>
                    <button 
                    className={`btn d-flex align-items-center gap-2 px-4 ${inWishlist ? "btn-danger" : "btn-outline-danger"}`} 
                    onClick={toggleWishlist}
                    >
                    <FiHeart fill={inWishlist ? "currentColor" : "none"} />
                    <span className="fw-medium">{inWishlist ? "Đã thích" : "Yêu thích"}</span>
                    </button>
                </div>

                <div className="d-flex gap-3 mb-4">
                    <button className="btn btn-primary btn-lg flex-grow-1 d-flex align-items-center justify-content-center gap-2" onClick={() => addToCart(product, qty)}>
                    <FiShoppingCart /> THÊM VÀO GIỎ
                    </button>
                    <button className="btn btn-dark btn-lg flex-grow-1" onClick={handleBuyNow}>MUA NGAY</button>
                </div>

                <hr />
                
                <div className="mt-3">
                    <h5 className="fw-bold mb-3 text-uppercase text-secondary">Thông số kỹ thuật</h5>
                    {product.specs ? (
                    <table className="table table-striped table-hover small border">
                        <tbody>
                        {Object.entries(product.specs).map(([k, v]) => {
                            // Chuẩn hóa key để tìm trong từ điển (lowercase)
                            const keyLower = k.toLowerCase().trim();
                            return (
                                <tr key={k}>
                                <th className="bg-light text-secondary" style={{width: "35%"}}>
                                    {SPEC_DICT[keyLower] || k}
                                </th>
                                <td>{String(v)}</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                    ) : <p className="text-muted">Đang cập nhật...</p>}
                </div>
                </div>
            </div>
            </div>

            {/* --- SẢN PHẨM VỪA XEM --- */}
            {recentProducts.length > 0 && (
                <div className="mt-5">
                    <h5 className="fw-bold mb-3 d-flex align-items-center gap-2 text-dark">
                        <FiClock /> Sản phẩm bạn vừa xem
                    </h5>
                    <div className="d-flex gap-3 overflow-auto pb-3">
                        {recentProducts.map(p => (
                            <Link to={`/products/${p.slug}`} key={p._id} className="card border shadow-sm text-decoration-none text-dark flex-shrink-0" style={{width: 160}}>
                                <img src={p.thumbnail || "https://placehold.co/150"} className="card-img-top p-2" alt={p.name} style={{height: 120, objectFit: "contain"}}/>
                                <div className="card-body p-2">
                                    <div className="text-truncate small fw-bold mb-1">{p.name}</div>
                                    <div className="text-primary small fw-bold">{p.price.toLocaleString()}đ</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {relatedProducts.length > 0 && (
            <div className="mt-5">
                <h4 className="fw-bold mb-4 border-start border-4 border-primary ps-3">Sản phẩm tương tự</h4>
                <div className="bg-white p-2 rounded shadow-sm">
                    <TrendingSlider products={relatedProducts} />
                </div>
            </div>
            )}

            <div className="row mt-5">
            <div className="col-12">
                <ProductReviews productId={product._id} />
            </div>
            </div>
        </div>
        </div>
    </HelmetProvider>
  );
}