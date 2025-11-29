import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

const CATEGORY_OPTIONS = [
  { value: "laptop", label: "Laptop" },
  { value: "man-hinh", label: "Màn hình" },
  { value: "ban-phim", label: "Bàn phím" },
  { value: "chuot", label: "Chuột" },
  { value: "tai-nghe", label: "Tai nghe" },
  { value: "loa", label: "Loa" },
  { value: "ghe-gaming", label: "Ghế gaming" },
  { value: "tay-cam", label: "Tay cầm" }
];

const emptyForm = {
  name: "",
  slug: "",
  categorySlug: "laptop",
  brand: "",
  price: "",
  oldPrice: "",
  stock: "",
  sku: "",
  images: [],
  description: "",
  tagsText: "",
  isFeatured: false,
  isNew: false,
  status: "active",
  specsText: ""
};

const formatMoney = (n) => {
  const num = typeof n === "number" ? n : Number(n || 0);
  return num.toLocaleString();
};

export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;

    let cancelled = false;
    setLoading(true);
    setError("");

    api
      .get(`/products/${id}`)
      .then((res) => {
        if (cancelled) return;
        const p = res.data;
        if (!p) {
          setError("Không tìm thấy sản phẩm.");
          return;
        }

        setForm({
          name: p.name || "",
          slug: p.slug || "",
          categorySlug: p.categorySlug || "laptop",
          brand: p.brand || "",
          price: p.price ?? "",
          oldPrice: p.oldPrice ?? "",
          stock: p.stock ?? "",
          sku: p.sku || "",
          images: p.images || [],
          description: p.description || p.shortDescription || "",
          tagsText: (p.tags || []).join(", "),
          isFeatured: !!p.isFeatured,
          isNew: !!p.isNew,
          status: p.status || "active",
          specsText: JSON.stringify(p.specs || {}, null, 2)
        });
      })
      .catch((e) => {
        console.error(e);
        setError("Không tải được dữ liệu sản phẩm.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleUploadImages = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    try {
      const uploaded = [];
      for (const file of files) {
        const fd = new FormData();
        fd.append("image", file);
        // eslint-disable-next-line no-await-in-loop
        const res = await api.post("/products/upload-image", fd, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        uploaded.push(res.data.url);
      }
      setForm((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...uploaded]
      }));
    } catch (err) {
      console.error(err);
      alert("Upload ảnh sản phẩm thất bại.");
    }
  };

  const removeImageAt = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const tags = form.tagsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    let specs;
    if (form.specsText.trim()) {
      try {
        specs = JSON.parse(form.specsText);
      } catch {
        setSaving(false);
        setError("JSON thông số kỹ thuật không hợp lệ.");
        return;
      }
    }

    const thumbnail =
      form.images && form.images.length > 0 ? form.images[0] : undefined;

    const desc = form.description.trim();

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      categorySlug: form.categorySlug,
      brand: form.brand.trim() || undefined,
      price: Number(form.price || 0),
      oldPrice: Number(form.oldPrice || 0),
      stock: Number(form.stock || 0),
      sku: form.sku.trim() || undefined,
      thumbnail,
      images: form.images || [],
      description: desc,
      shortDescription: desc,
      tags,
      specs,
      isFeatured: !!form.isFeatured,
      isNew: !!form.isNew,
      status: form.status
    };

    if (!payload.name || !payload.slug) {
      setSaving(false);
      setError("Vui lòng nhập tên và slug sản phẩm.");
      return;
    }

    try {
      if (isEdit) {
        await api.put(`/products/${id}`, payload);
      } else {
        await api.post("/products", payload);
      }
      navigate("/admin/products");
    } catch (err) {
      console.error("SAVE PRODUCT ERROR:", err.response?.data || err.message);
      setError(
        err.response?.data?.message ||
          "Lưu sản phẩm thất bại, vui lòng thử lại."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container my-4">
        <p>Đang tải dữ liệu sản phẩm...</p>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>{isEdit ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}</h4>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => navigate("/admin/products")}
        >
          Quay lại danh sách
        </button>
      </div>

      <div className="bg-white rounded-3 shadow-sm p-3">
        {error && <p className="text-danger">{error}</p>}

        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-lg-8">
            <div className="mb-3">
              <label className="form-label">Tên sản phẩm</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Slug{" "}
                <small className="text-muted">
                  (không dấu, cách nhau bằng dấu gạch ngang)
                </small>
              </label>
              <input
                type="text"
                className="form-control"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                required
              />
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Danh mục</label>
                <select
                  className="form-select"
                  name="categorySlug"
                  value={form.categorySlug}
                  onChange={handleChange}
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Thương hiệu</label>
                <input
                  type="text"
                  className="form-control"
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Mã SKU</label>
                <input
                  type="text"
                  className="form-control"
                  name="sku"
                  value={form.sku}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Giá bán</label>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  min="0"
                  required
                />
                {form.price && (
                  <div className="form-text">
                    {formatMoney(form.price)} đ
                  </div>
                )}
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Giá cũ (nếu có)</label>
                <input
                  type="number"
                  className="form-control"
                  name="oldPrice"
                  value={form.oldPrice}
                  onChange={handleChange}
                  min="0"
                />
                {form.oldPrice && (
                  <div className="form-text">
                    {formatMoney(form.oldPrice)} đ
                  </div>
                )}
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Tồn kho</label>
                <input
                  type="number"
                  className="form-control"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Mô tả sản phẩm</label>
              <textarea
                className="form-control"
                rows="6"
                name="description"
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Thông số kỹ thuật (JSON){" "}
                <small className="text-muted">
                  (ví dụ: {"{ \"cpu\": \"i5\", \"ram\": \"16GB\" }"})
                </small>
              </label>
              <textarea
                className="form-control"
                rows="5"
                name="specsText"
                value={form.specsText}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Tags{" "}
                <small className="text-muted">
                  (cách nhau bằng dấu phẩy, ví dụ: gaming, office)
                </small>
              </label>
              <input
                type="text"
                className="form-control"
                name="tagsText"
                value={form.tagsText}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="col-lg-4">
            <div className="mb-3">
              <label className="form-label">
                Ảnh sản phẩm (chọn nhiều, ảnh đầu tiên sẽ làm thumbnail)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                className="form-control mb-2"
                onChange={handleUploadImages}
              />
              {form.images?.length > 0 && (
                <div className="d-flex flex-wrap gap-2">
                  {form.images.map((url, idx) => (
                    <div
                      key={url + idx}
                      className="position-relative border rounded p-1 bg-light"
                      style={{ width: 90, height: 90 }}
                    >
                      <img
                        src={url}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover"
                        }}
                      />
                      {idx === 0 && (
                        <span className="badge bg-primary position-absolute top-0 start-0">
                          Thumb
                        </span>
                      )}
                      <button
                        type="button"
                        className="btn btn-sm btn-danger position-absolute top-0 end-0 translate-middle"
                        onClick={() => removeImageAt(idx)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="isFeatured"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="isFeatured">
                Sản phẩm nổi bật
              </label>
            </div>

            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="isNew"
                name="isNew"
                checked={form.isNew}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="isNew">
                Sản phẩm mới
              </label>
            </div>

            <div className="mb-3">
              <label className="form-label">Trạng thái</label>
              <select
                className="form-select"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="active">Đang bán</option>
                <option value="hidden">Ẩn</option>
                <option value="draft">Nháp</option>
              </select>
            </div>

            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving
                  ? "Đang lưu..."
                  : isEdit
                  ? "Cập nhật sản phẩm"
                  : "Tạo sản phẩm"}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate("/admin/products")}
              >
                Hủy
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
