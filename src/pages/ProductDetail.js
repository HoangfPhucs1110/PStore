import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [tab, setTab] = useState("info");
  const { addItem } = useCart();

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => setProduct(res.data));
  }, [id]);

  if (!product) return <div className="container my-3">Đang tải...</div>;

  const specs = product.specs || {};

  return (
    <div className="container my-3">
      <div className="row g-4">
        <div className="col-md-5">
          <div className="border rounded p-3 mb-2 bg-white">
            <img
              src={product.thumbnail || product.images?.[0]}
              alt={product.name}
              style={{ width: "100%", objectFit: "contain", maxHeight: 320 }}
            />
          </div>
          <div className="d-flex flex-wrap gap-2">
            {product.images?.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt=""
                style={{
                  width: 64,
                  height: 64,
                  objectFit: "cover",
                  borderRadius: 8,
                  border:
                    img === product.thumbnail ? "2px solid #0d6efd" : "1px solid #eee"
                }}
              />
            ))}
          </div>
        </div>

        <div className="col-md-7">
          <h4 className="mb-2">{product.name}</h4>
          <div className="mb-2 text-muted small">{product.brand}</div>
          <div className="d-flex align-items-end gap-3 mb-3">
            <div className="fs-4 fw-bold text-danger">
              {product.price.toLocaleString()} đ
            </div>
            {product.oldPrice > product.price && (
              <div className="text-muted text-decoration-line-through">
                {product.oldPrice.toLocaleString()} đ
              </div>
            )}
          </div>
          <div className="mb-2">
            Tình trạng:{" "}
            {product.stock > 0 ? (
              <span className="text-success fw-semibold">Còn hàng</span>
            ) : (
              <span className="text-danger fw-semibold">Hết hàng</span>
            )}
          </div>
          <button
            className="btn btn-primary me-2"
            disabled={product.stock === 0}
            onClick={() => addItem(product, 1)}
          >
            Thêm vào giỏ
          </button>
          <button
            className="btn btn-outline-primary"
            disabled={product.stock === 0}
            onClick={() => addItem(product, 1)}
          >
            Mua ngay
          </button>
        </div>
      </div>

      <div className="mt-4 bg-white rounded-3 shadow-sm">
        <div className="border-bottom d-flex">
          <button
            className={
              "btn flex-fill rounded-0 " +
              (tab === "info" ? "btn-light border-bottom-0 fw-semibold" : "btn-link")
            }
            onClick={() => setTab("info")}
          >
            Thông tin sản phẩm
          </button>
          <button
            className={
              "btn flex-fill rounded-0 " +
              (tab === "specs" ? "btn-light border-bottom-0 fw-semibold" : "btn-link")
            }
            onClick={() => setTab("specs")}
          >
            Thông số kỹ thuật
          </button>
        </div>

        <div className="p-3">
          {tab === "info" && (
            <div>
              {product.description ? (
                <p style={{ whiteSpace: "pre-line" }}>{product.description}</p>
              ) : (
                <p className="text-muted">
                  Chưa có mô tả chi tiết cho sản phẩm này.
                </p>
              )}
            </div>
          )}

          {tab === "specs" && (
            <table className="table mb-0">
              <tbody>
                {Object.keys(specs).length === 0 && (
                  <tr>
                    <td className="text-muted small">
                      Chưa cập nhật thông số kỹ thuật.
                    </td>
                  </tr>
                )}
                {Object.entries(specs).map(([key, value]) => (
                  <tr key={key}>
                    <th style={{ width: 180 }}>{key}</th>
                    <td>{String(value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
