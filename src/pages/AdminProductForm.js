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
  price: 0,
  oldPrice: 0,
  stock: 0,
  description: "",
  images: []
};

const emptySpecRow = { key: "", value: "" };

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(emptyForm);
  const [specRows, setSpecRows] = useState([emptySpecRow]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!id) return;

    api.get(`/products/${id}`).then((res) => {
      const p = res.data;
      setForm({
        name: p.name || "",
        slug: p.slug || "",
        categorySlug: p.categorySlug || "laptop",
        brand: p.brand || "",
        price: p.price || 0,
        oldPrice: p.oldPrice || 0,
        stock: p.stock || 0,
        description: p.description || "",
        images: p.images || []
      });

      const specs = p.specs || {};
      const rows = Object.entries(specs).map(([key, value]) => ({
        key,
        value: String(value)
      }));
      setSpecRows(rows.length ? rows : [emptySpecRow]);
    });
  }, [id]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);
    try {
      const newUrls = [];
      for (const file of files) {
        const fd = new FormData();
        fd.append("image", file);
        const res = await api.post("/products/upload-image", fd, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        newUrls.push(res.data.url);
      }
      setForm((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...newUrls]
      }));
    } catch (err) {
      console.error(err);
      alert("Upload ảnh bị lỗi, thử lại sau.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url) => {
    setForm((prev) => ({
      ...prev,
      images: (prev.images || []).filter((x) => x !== url)
    }));
  };

  const handleSpecChange = (index, field, value) => {
    setSpecRows((rows) =>
      rows.map((row, i) =>
        i === index ? { ...row, [field]: value } : row
      )
    );
  };

  const addSpecRow = () => {
    setSpecRows((rows) => [...rows, emptySpecRow]);
  };

  const removeSpecRow = (index) => {
    setSpecRows((rows) =>
      rows.length === 1 ? [emptySpecRow] : rows.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const specs = {};
    specRows
      .filter((r) => r.key.trim() && r.value.trim())
      .forEach((r) => {
        specs[r.key.trim()] = r.value.trim();
      });

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      categorySlug: form.categorySlug,
      brand: form.brand.trim(),
      price: Number(form.price) || 0,
      oldPrice: Number(form.oldPrice) || 0,
      stock: Number(form.stock) || 0,
      description: form.description,
      images: form.images || [],
      thumbnail: (form.images || [])[0] || "",
      specs
    };

    if (isEdit) {
      await api.put(`/products/${id}`, payload);
    } else {
      await api.post("/products", payload);
    }

    navigate("/admin/products");
  };

  return (
    <div className="container my-3">
      <h3 className="mb-3">
        {isEdit ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
      </h3>

      <div className="bg-white rounded-3 shadow-sm p-3">
        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            {/* Cột trái: thông tin cơ bản */}
            <div className="col-12 col-lg-6">
              <div className="mb-2">
                <label className="form-label">Tên sản phẩm</label>
                <input
                  className="form-control"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Slug (đường dẫn)</label>
                <input
                  className="form-control"
                  value={form.slug}
                  onChange={(e) => handleChange("slug", e.target.value)}
                  required
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Danh mục</label>
                <select
                  className="form-select"
                  value={form.categorySlug}
                  onChange={(e) =>
                    handleChange("categorySlug", e.target.value)
                  }
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-2">
                <label className="form-label">Hãng</label>
                <input
                  className="form-control"
                  value={form.brand}
                  onChange={(e) => handleChange("brand", e.target.value)}
                />
              </div>

              <div className="row g-2 mb-2">
                <div className="col-6">
                  <label className="form-label">Giá hiện tại</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label">Giá cũ (nếu có)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.oldPrice}
                    onChange={(e) =>
                      handleChange("oldPrice", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="mb-2">
                <label className="form-label">Tồn kho</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.stock}
                  onChange={(e) => handleChange("stock", e.target.value)}
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Mô tả chi tiết</label>
                <textarea
                  className="form-control"
                  rows={5}
                  value={form.description}
                  onChange={(e) =>
                    handleChange("description", e.target.value)
                  }
                  placeholder="Ví dụ: mô tả cấu hình, ưu điểm nổi bật..."
                />
              </div>
            </div>

            {/* Cột phải: ảnh + thông số kỹ thuật */}
            <div className="col-12 col-lg-6">
              <div className="mb-3">
                <label className="form-label">
                  Ảnh sản phẩm (ảnh đầu tiên sẽ làm thumbnail)
                </label>
                <input
                  type="file"
                  multiple
                  className="form-control"
                  onChange={handleFiles}
                />
                {uploading && (
                  <div className="small text-muted mt-1">
                    Đang upload ảnh...
                  </div>
                )}
              </div>

              {form.images?.length > 0 && (
                <div className="mb-3">
                  <div className="small text-muted mb-1">
                    Ảnh đã upload (khung xanh = thumbnail)
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {form.images.map((url, idx) => (
                      <div key={url} className="position-relative">
                        <img
                          src={url}
                          alt=""
                          style={{
                            width: 72,
                            height: 72,
                            objectFit: "cover",
                            borderRadius: 8,
                            border:
                              idx === 0
                                ? "2px solid #0d6efd"
                                : "1px solid #dee2e6"
                          }}
                        />
                        <button
                          type="button"
                          className="btn btn-sm btn-light border position-absolute top-0 end-0 p-0 px-1"
                          onClick={() => removeImage(url)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label mb-0">
                    Thông số kỹ thuật (tùy loại sản phẩm)
                  </label>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary"
                    onClick={addSpecRow}
                  >
                    + Thêm dòng
                  </button>
                </div>

                {specRows.map((row, index) => (
                  <div className="row g-2 mb-2" key={index}>
                    <div className="col-5">
                      <input
                        className="form-control"
                        placeholder="Thuộc tính (VD: DPI)"
                        value={row.key}
                        onChange={(e) =>
                          handleSpecChange(index, "key", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-5">
                      <input
                        className="form-control"
                        placeholder="Giá trị (VD: 16.000)"
                        value={row.value}
                        onChange={(e) =>
                          handleSpecChange(index, "value", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-2 d-flex align-items-center">
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm w-100"
                        onClick={() => removeSpecRow(index)}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-3 d-flex justify-content-between">
            <button className="btn btn-primary">
              {isEdit ? "Cập nhật sản phẩm" : "Tạo sản phẩm"}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => navigate("/admin/products")}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
