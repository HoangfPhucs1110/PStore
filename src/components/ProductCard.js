import { Link } from "react-router-dom";

export default function ProductCard({ p }) {
  const img = p.thumbnail || p.images?.[0];

  return (
    <div className="card h-100 product-card shadow-sm border-0">
      <Link
        to={`/products/${p._id}`}
        className="text-decoration-none text-dark"
      >
        <div className="ratio ratio-4x3 bg-light rounded-top">
          {img && (
            <img
              src={img}
              alt={p.name}
              className="w-100 h-100"
              style={{ objectFit: "cover" }}
            />
          )}
        </div>
        <div className="card-body p-2">
          <p className="small text-muted mb-1 text-uppercase">
            {p.brand} · {p.categorySlug}
          </p>
          <h6 className="card-title mb-1 product-name-2line">{p.name}</h6>
          <div className="d-flex align-items-baseline gap-2">
            <span className="fw-bold text-primary">
              {p.price.toLocaleString()} đ
            </span>
            {p.oldPrice && (
              <span className="small text-muted text-decoration-line-through">
                {p.oldPrice.toLocaleString()} đ
              </span>
            )}
          </div>
        </div>
      </Link>
      <div className="card-footer bg-white border-0 pt-0 pb-2 px-2">
        <Link
          to={`/products/${p._id}`}
          className="btn btn-primary w-100 btn-sm"
        >
          Xem chi tiết
        </Link>
      </div>
    </div>
  );
}
