import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { FiShoppingCart } from "react-icons/fi";
import { getImageUrl } from "../../utils/constants";
import { useNotification } from "../../context/NotificationContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { notify } = useNotification();
  
  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

  const handleAddToCart = (e) => {
    e.preventDefault(); 
    e.stopPropagation(); // Ngăn click nhầm vào Link chi tiết
    
    addToCart(product);
    notify(`Đã thêm "${product.name}" vào giỏ hàng`, "success");
  };

  return (
    <div className="card h-100 group border-0 shadow-sm hover-shadow-md transition-all">
      <Link to={`/products/${product.slug}`} className="product-card-img-wrapper d-block position-relative bg-white rounded-top overflow-hidden">
        <img 
          src={getImageUrl(product.thumbnail || product.images?.[0])} 
          alt={product.name} 
          className="product-card-img w-100 h-100 object-fit-contain p-3 transition-transform group-hover-scale"
          onError={(e) => e.target.src = "https://via.placeholder.com/300?text=PStore"}
        />
        {discount > 0 && (
            <span className="position-absolute top-0 start-0 m-2 badge bg-danger text-white shadow-sm">
                -{discount}%
            </span>
        )}
      </Link>

      <div className="card-body d-flex flex-column p-3">
        <div className="small text-muted mb-1 text-uppercase fw-bold" style={{fontSize: 10}}>{product.brand || "Brand"}</div>
        <Link to={`/products/${product.slug}`} className="text-decoration-none mb-2">
          <h6 className="card-title text-dark fw-semibold text-truncate-2" style={{height: 40, fontSize: 14, lineHeight: '20px'}}>
            {product.name}
          </h6>
        </Link>
        
        <div className="mt-auto">
          <div className="d-flex align-items-center gap-2 mb-3">
            <span className="fw-bold text-primary fs-6">{product.price?.toLocaleString()}đ</span>
            {product.oldPrice > product.price && (
              <span className="small text-muted text-decoration-line-through" style={{fontSize: 11}}>{product.oldPrice.toLocaleString()}đ</span>
            )}
          </div>
          
          <button 
            className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2 btn-sm rounded-pill fw-medium hover-bg-primary hover-text-white transition-colors"
            onClick={handleAddToCart}
          >
            <FiShoppingCart size={16} /> Thêm vào giỏ
          </button>
        </div>
      </div>
      
      <style>{`
        .text-truncate-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .group:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1)!important; }
        .group-hover-scale:hover { transform: scale(1.05); }
      `}</style>
    </div>
  );
}