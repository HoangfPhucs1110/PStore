import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const formatPrice = (p) => p?.toLocaleString("vi-VN") + "đ";

  return (
    <div className="card h-100 border-0 shadow-sm product-card">
      <Link to={`/products/${product.slug}`} className="position-relative overflow-hidden" style={{ height: 200 }}>
        <img
          src={product.thumbnail || product.images?.[0] || "/placeholder.png"}
          className="card-img-top w-100 h-100 object-fit-contain p-3"
          alt={product.name}
        />
        {product.oldPrice > product.price && (
          <span className="position-absolute top-0 start-0 badge bg-danger m-2">
            -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
          </span>
        )}
      </Link>
      <div className="card-body d-flex flex-column">
        <Link to={`/products/${product.slug}`} className="text-decoration-none text-dark">
          <h6 className="card-title text-truncate-2" title={product.name}>
            {product.name}
          </h6>
        </Link>
        <div className="mt-auto">
          <div className="d-flex align-items-center gap-2">
            <span className="fw-bold text-primary">{formatPrice(product.price)}</span>
            {product.oldPrice > product.price && (
              <span className="small text-muted text-decoration-line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
          <button 
            className="btn btn-sm btn-outline-primary w-100 mt-2"
            onClick={() => addToCart(product)}
          >
            Thêm vào giỏ
          </button>
        </div>
      </div>
    </div>
  );
}