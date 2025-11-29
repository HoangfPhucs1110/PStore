import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { useCart } from "../context/CartContext";

const formatMoney = (n) => {
  const num = typeof n === "number" ? n : Number(n || 0);
  return num.toLocaleString();
};

export default function ProductDetail() {
  const { slug } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [activeImg, setActiveImg] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) {
      setError("Không tìm thấy sản phẩm.");
      setLoading(false);
      return;
    }

    let ignore = false;
    setLoading(true);
    setError("");

    api
      .get(`/products/slug/${slug}`)
      .then((res) => {
        if (ignore) return;
        const p = res.data;
        setProduct(p);
        const img = p.thumbnail || (p.images && p.images[0]);
        if (img) setActiveImg(img);
      })
      .catch((err) => {
        console.error("GET /products/slug", err);
        if (err.response?.status === 404) {
          setError("Không tìm thấy sản phẩm.");
        } else {
          setError("Tải sản phẩm thất bại, vui lòng thử lại sau.");
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [slug]);

  if (loading)
    return (
      <div className="container my-3">
        <p>Đang tải...</p>
      </div>
    );

  if (error)
    return (
      <div className="container my-3">
        <h5>{error}</h5>
      </div>
    );

  if (!product)
    return (
      <div className="container my-3">
        <h5>Không tìm thấy sản phẩm</h5>
      </div>
    );

  const images = [];
  if (product.thumbnail) images.push(product.thumbnail);
  if (Array.isArray(product.images)) {
    product.images.forEach((img) => {
      if (img && !images.includes(img)) images.push(img);
    });
  }
  const specs = product.specs || {};
  const stock = typeof product.stock === "number" ? product.stock : 0;
  const outOfStock = stock <= 0;

  const handleAdd = () => {
    if (outOfStock) return;
    addToCart(product, 1);
  };

  const handleBuyNow = () => {
    if (outOfStock) return;
    addToCart(product, 1);
    window.location.href = "/checkout";
  };

  return (
    <div className="container my-3">
      <div className="row g-4">
        {/* Hình ảnh */}
        <div className="col-lg-5">
          <div className="bg-white rounded-3 shadow-sm p-3 mb-2 text-center">
            {activeImg || images[0] ? (
              <img
                src={activeImg || images[0]}
                alt={product.name}
                style={{
                  maxWidth: "100%",
                  maxHeight: 360,
                  objectFit: "contain"
                }}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/400x300?text=No+Image";
                }}
              />
            ) : (
              <div className="text-muted small">Chưa có hình ảnh</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="d-flex gap-2 flex-wrap">
              {images.map((url) => (
                <button
                  type="button"
                  key={url}
                  className={
                    "border-0 p-0 bg-transparent " +
                    (url === activeImg ? "thumb-active" : "")
                  }
                  onClick={() => setActiveImg(url)}
                >
                  <img
                    src={url}
                    alt=""
                    style={{
                      width: 64,
                      height: 64,
                      objectFit: "cover",
                      borderRadius: 8,
                      border:
                        url === activeImg
                          ? "2px solid #0d6efd"
                          : "1px solid #dee2e6"
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Thông tin */}
        <div className="col-lg-7">
          <div className="bg-white rounded-3 shadow-sm p-3 mb-3">
            <h4 className="mb-1">{product.name}</h4>
            <div className="text-muted mb-2">
              Thương hiệu: {product.brand || "Đang cập nhật"}
            </div>
            <div className="d-flex align-items-baseline gap-2 mb-2">
              <span className="fs-4 fw-bold text-danger">
                {formatMoney(product.price)} đ
              </span>
              {product.oldPrice > product.price && (
                <span className="text-muted text-decoration-line-through">
                  {formatMoney(product.oldPrice)} đ
                </span>
              )}
            </div>
            <div className="mb-3">
              Tình trạng:{" "}
              <span className={outOfStock ? "text-danger fw-semibold" : "text-success fw-semibold"}>
                {outOfStock ? "Hết hàng" : "Còn hàng"}
              </span>
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn btn-primary"
                onClick={handleAdd}
                disabled={outOfStock}
              >
                {outOfStock ? "Hết hàng" : "Thêm vào giỏ"}
              </button>
              <button
                className="btn btn-outline-primary"
                onClick={handleBuyNow}
                disabled={outOfStock}
              >
                {outOfStock ? "Hết hàng" : "Mua ngay"}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3 shadow-sm p-3">
            <h5 className="mb-3">Thông số kỹ thuật</h5>
            {Object.keys(specs).length ? (
              <table className="table table-sm mb-3">
                <tbody>
                  {Object.entries(specs).map(([k, v]) => (
                    <tr key={k}>
                      <th style={{ width: "35%" }}>{k}</th>
                      <td>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-muted small mb-3">
                Chưa có thông số kỹ thuật cho sản phẩm này.
              </div>
            )}

            <h5 className="mb-2">Thông tin sản phẩm</h5>
            <p className="mb-0">
              {product.description ||
                "Chưa có mô tả chi tiết cho sản phẩm này."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
