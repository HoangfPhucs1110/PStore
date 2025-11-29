import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImg, setActiveImg] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    api.get(`/products/slug/${slug}`).then((res) => {
      const p = res.data;
      setProduct(p);
      const img = p.thumbnail || (p.images && p.images[0]);
      setActiveImg(img || "");
    });
  }, [slug]);

  if (!product) return <div className="container my-3">Đang tải...</div>;

  const images = product.images && product.images.length ? product.images : [activeImg];
  const specs = product.specs || {};

  return (
    <div className="container my-3">
      <div className="row g-4">
        {/* Ảnh */}
        <div className="col-lg-5">
          <div className="bg-white rounded-3 shadow-sm p-3 mb-2 text-center">
            {activeImg ? (
              <img
                src={activeImg}
                alt={product.name}
                style={{ maxWidth: "100%", maxHeight: 360, objectFit: "contain" }}
              />
            ) : (
              <div className="text-muted small">Chưa có hình ảnh</div>
            )}
          </div>
          <div className="d-flex gap-2 flex-wrap">
            {images.map(
              (url) =>
                url && (
                  <button
                    key={url}
                    type="button"
                    className={
                      "border-0 p-0 bg-transparent thumb-btn " +
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
                )
            )}
          </div>
        </div>

        {/* Thông tin chính */}
        <div className="col-lg-7">
          <div className="bg-white rounded-3 shadow-sm p-3 mb-3">
            <h4 className="mb-1">{product.name}</h4>
            <div className="text-muted mb-2">{product.brand}</div>
            <div className="d-flex align-items-baseline gap-2 mb-2">
              <span className="fs-4 fw-bold text-danger">
                {product.price.toLocaleString()} đ
              </span>
              {product.oldPrice > product.price && (
                <span className="text-muted text-decoration-line-through">
                  {product.oldPrice.toLocaleString()} đ
                </span>
              )}
            </div>
            <div className="mb-3">
              Tình trạng:{" "}
              <span className="text-success fw-semibold">
                {product.stock > 0 ? "Còn hàng" : "Hết hàng"}
              </span>
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn btn-primary"
                onClick={() => addToCart(product, 1)}
              >
                Thêm vào giỏ
              </button>
              <button
                className="btn btn-outline-primary"
                onClick={() => {
                  addToCart(product, 1);
                  window.location.href = "/checkout";
                }}
              >
                Mua ngay
              </button>
            </div>
          </div>

          {/* Thông số kỹ thuật + mô tả */}
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
