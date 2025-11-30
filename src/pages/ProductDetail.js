import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import ProductImageGallery from "../components/product/ProductImageGallery";
import "./ProductDetail.css";
import ProductReviews from "../components/product/ProductReviews";


const formatMoney = (n) => {
  const num = typeof n === "number" ? n : Number(n || 0);
  return num.toLocaleString();
};

export default function ProductDetail() {
  const { slug } = useParams();
  const nav = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function fetchData() {
      try {
        setLoading(true);
        const { data } = await api.get(`/products/slug/${slug}`);

        if (!ignore) {
          setProduct(data);
          setQty(1);
        }

        if (user) {
          try {
            const res = await api.get("/wishlists");
            const ids = res.data?.productIds || [];
            if (!ignore) {
              setInWishlist(ids.some((id) => id === data._id));
            }
          } catch (err) {
            console.error(err);
          }
        }
      } catch (err) {
        console.error(err);
        if (!ignore) setError("Không tìm thấy sản phẩm.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchData();
    return () => {
      ignore = true;
    };
  }, [slug, user]);

  const images = useMemo(() => {
    if (!product) return [];
    const arr = [];
    if (product.thumbnail) arr.push(product.thumbnail);
    if (Array.isArray(product.images)) {
      product.images.forEach((i) => i && !arr.includes(i) && arr.push(i));
    }
    return arr;
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, qty);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    nav("/checkout");
  };

  const toggleWishlist = async () => {
    if (!user) {
      nav("/login");
      return;
    }
    if (!product || wishlistLoading) return;

    try {
      setWishlistLoading(true);
      const { data } = await api.post("/wishlists/toggle", {
        productId: product._id
      });
      const ids = data?.productIds || [];
      setInWishlist(ids.some((id) => id === product._id));
    } catch (err) {
      console.error(err);
    } finally {
      setWishlistLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container my-3">
        <p>Đang tải...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container my-3">
        <h5>{error || "Không tìm thấy sản phẩm."}</h5>
      </div>
    );
  }

  return (
    <div className="bg-light py-4">
      <div className="container">
        <div className="row g-4">
          {/* Hình ảnh */}
          <div className="col-md-5">
            <ProductImageGallery images={images} />
          </div>

          {/* Thông tin */}
          <div className="col-md-7">
            <h4 className="fw-bold mb-1">{product.name}</h4>
            <div className="text-muted small mb-2">
              {product.brand && (
                <span className="me-3">Thương hiệu: {product.brand}</span>
              )}
              {product.sku && <span>Mã sản phẩm: {product.sku}</span>}
            </div>

            {product.ratingCount > 0 && (
              <div className="mb-2 small text-warning">
                ★ {product.ratingAvg?.toFixed(1)} / 5{" "}
                <span className="text-muted">
                  ({product.ratingCount} đánh giá)
                </span>
              </div>
            )}

            <div className="d-flex align-items-baseline gap-3 mb-3">
              <div className="h4 mb-0 text-danger">
                {formatMoney(product.price)} đ
              </div>
              {product.oldPrice > product.price && (
                <div className="text-muted text-decoration-line-through">
                  {formatMoney(product.oldPrice)} đ
                </div>
              )}
            </div>

            <div className="mb-3 small">
              {product.stock > 0 ? (
                <span className="text-success">
                  Còn hàng ({product.stock} sản phẩm)
                </span>
              ) : (
                <span className="text-danger">Hết hàng</span>
              )}
            </div>

            {/* Số lượng + nút */}
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="d-flex align-items-center border rounded-pill px-2">
                <button
                  type="button"
                  className="btn btn-sm btn-link text-decoration-none px-2"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  -
                </button>
                <span className="px-2">{qty}</span>
                <button
                  type="button"
                  className="btn btn-sm btn-link text-decoration-none px-2"
                  onClick={() => setQty((q) => q + 1)}
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                Thêm vào giỏ
              </button>
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
              >
                Mua ngay
              </button>
            </div>

            <button
              type="button"
              className="btn btn-outline-danger btn-sm mb-3"
              onClick={toggleWishlist}
              disabled={wishlistLoading}
            >
              {inWishlist ? "♥ Đã yêu thích" : "♡ Thêm vào yêu thích"}
            </button>

            <h5 className="mb-2">Thông tin sản phẩm</h5>
            <p className="mb-0">
              {product.description || "Chưa có mô tả chi tiết cho sản phẩm này."}
            </p>

            {product.specs && (
              <div className="mt-3">
                <h6 className="fw-semibold">Thông số kỹ thuật</h6>
                <ul className="small mb-0">
                  {Object.entries(product.specs).map(([k, v]) => (
                    <li key={k}>
                      <strong>{k}:</strong> {String(v)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        {/* ==== PHẦN ĐÁNH GIÁ SẢN PHẨM ==== */}
            {product.specs && (
              <div className="mt-3">
                <h6 className="fw-semibold">Thông số kỹ thuật</h6>
                <ul className="small mb-0">
                  {Object.entries(product.specs).map(([k, v]) => (
                    <li key={k}>
                      <strong>{k}:</strong> {String(v)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <ProductReviews productId={product._id} />

      </div>
    </div>
  );
}
