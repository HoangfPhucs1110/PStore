import { Link } from "react-router-dom";

export default function ProductCard({ p }) {
  const img = p.thumbnail || p.images?.[0];

  return (
    <div className="card h-100 product-card shadow-sm border-0">
      <Link
        to={`/products/${p.slug}`}
        className="text-decoration-none text-dark"
      >
        <div className="ratio ratio-4x3 bg-light rounded-top">
          {img && (
            <img
              src={img}
              alt={p.name}
              className="card-img-top rounded-top"
              style={{ objectFit: "cover" }}
            />
          )}
        </div>
      </Link>

      <div className="card-body d-flex flex-column">
        <Link
          to={`/products/${p.slug}`}
          className="text-decoration-none text-dark"
        >
          <h6 className="card-title mb-1 text-truncate">{p.name}</h6>
        </Link>
        <div className="mb-2 small text-muted text-truncate">
          {p.brand || "Thương hiệu khác"}
        </div>

        <div className="mt-auto">
          <div className="d-flex align-items-baseline gap-2">
            <span className="fw-bold text-primary">
              {p.price.toLocaleString()}đ
            </span>
            {p.oldPrice && p.oldPrice > p.price && (
              <span className="text-muted text-decoration-line-through small">
                {p.oldPrice.toLocaleString()}đ
              </span>
            )}
          </div>
          {p.oldPrice && p.oldPrice > p.price && (
            <span className="badge bg-danger-subtle text-danger mt-1">
              -{Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
