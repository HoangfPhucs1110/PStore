import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import "./ProductCard.css";

export default function ProductCard({ p }) {
  const images = useMemo(() => {
    const arr = [];
    if (p.thumbnail) arr.push(p.thumbnail);
    if (Array.isArray(p.images)) {
      p.images.forEach((i) => i && !arr.includes(i) && arr.push(i));
    }
    return arr;
  }, [p]);

  const [index, setIndex] = useState(0);
  const img = images[index] || "";

  const next = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!images.length) return;
    setIndex((i) => (i + 1) % images.length);
  };

  const prev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!images.length) return;
    setIndex((i) => (i - 1 + images.length) % images.length);
  };

  return (
    <div className="product-card-wrapper">
      <div className="card h-100 product-card border-0">
        <Link
          to={`/products/${p.slug}`}
          className="text-decoration-none text-dark"
        >
          <div className="product-image-box position-relative">
            {img && (
              <img
                src={img}
                alt={p.name}
                className="product-image"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/400x300?text=No+Image";
                }}
              />
            )}

            {images.length > 1 && (
              <>
                <button
                  className="product-nav-btn left"
                  onClick={prev}
                  aria-label="Prev"
                >
                  ‹
                </button>
                <button
                  className="product-nav-btn right"
                  onClick={next}
                  aria-label="Next"
                >
                  ›
                </button>

                <div className="product-dots">
                  {images.map((_, i) => (
                    <span
                      key={i}
                      className={
                        "product-dot" + (i === index ? " active" : "")
                      }
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </Link>

        <div className="card-body d-flex flex-column">
          <Link
            to={`/products/${p.slug}`}
            className="text-decoration-none text-dark"
          >
            <h6 className="card-title mb-1 two-line-ellipsis">{p.name}</h6>
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
                -
                {Math.round(
                  ((p.oldPrice - p.price) / p.oldPrice) * 100
                )}
                %
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
