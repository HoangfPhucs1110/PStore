import { useEffect, useState } from "react";
import api from "../api";

const emptyForm = {
  name: "",
  slug: "",
  categorySlug: "laptop",
  brand: "",
  price: 0,
  oldPrice: 0,
  stock: 0,
  thumbnail: "",
  imagesText: ""
};

export default function AdminProducts() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const load = () => api.get("/products").then((res) => setList(res.data));

  useEffect(() => {
    load();
  }, []);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("image", file);
    setUploading(true);
    try {
      const res = await api.post("/products/upload-image", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setForm((f) => ({ ...f, thumbnail: res.data.url }));
    } catch (err) {
      console.error("Upload lỗi", err);
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();

    const images = form.imagesText
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);

    const payload = {
      name: form.name,
      slug: form.slug,
      categorySlug: form.categorySlug,
      brand: form.brand,
      price: form.price,
      oldPrice: form.oldPrice,
      stock: form.stock,
      thumbnail: form.thumbnail || images[0] || "",
      images
    };

    if (editId) {
      await api.put(`/products/${editId}`, payload);
    } else {
      await api.post("/products", payload);
    }

    setForm(emptyForm);
    setEditId(null);
    load();
  };

  const edit = (p) => {
    setEditId(p._id);
    setForm({
      name: p.name,
      slug: p.slug,
      categorySlug: p.categorySlug,
      brand: p.brand,
      price: p.price,
      oldPrice: p.oldPrice || 0,
      stock: p.stock,
      thumbnail: p.thumbnail || p.images?.[0] || "",
      imagesText: (p.images || []).join("\n")
    });
  };

  const remove = async (id) => {
    if (!window.confirm("Xóa sản phẩm này?")) return;
    await api.delete(`/products/${id}`);
    load();
  };

  return (
    <div className="container mt-3">
      <h3 className="mb-3">Quản lý sản phẩm</h3>
      <div className="row g-3">
        <div className="col-md-4">
          <div className="bg-white rounded-3 shadow-sm p-3">
            <h6 className="mb-3">
              {editId ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
            </h6>
            <form onSubmit={submit}>
              <input
                className="form-control mb-2"
                placeholder="Tên sản phẩm"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                className="form-control mb-2"
                placeholder="Slug (đường dẫn)"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                required
              />
              <select
                className="form-select mb-2"
                value={form.categorySlug}
                onChange={(e) =>
                  setForm({ ...form, categorySlug: e.target.value })
                }
              >
                <option value="laptop">Laptop</option>
                <option value="man-hinh">Màn hình</option>
                <option value="ban-phim">Bàn phím</option>
                <option value="chuot">Chuột</option>
                <option value="tai-nghe">Tai nghe</option>
                <option value="loa">Loa</option>
                <option value="ghe-gaming">Ghế gaming</option>
                <option value="tay-cam">Tay cầm</option>
              </select>
              <input
                className="form-control mb-2"
                placeholder="Hãng"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
              />
              <div className="row">
                <div className="col-6 mb-2">
                  <input
                    className="form-control"
                    type="number"
                    placeholder="Giá"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: Number(e.target.value) })
                    }
                    required
                  />
                </div>
                <div className="col-6 mb-2">
                  <input
                    className="form-control"
                    type="number"
                    placeholder="Giá cũ"
                    value={form.oldPrice}
                    onChange={(e) =>
                      setForm({ ...form, oldPrice: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
              <input
                className="form-control mb-2"
                type="number"
                placeholder="Tồn kho"
                value={form.stock}
                onChange={(e) =>
                  setForm({ ...form, stock: Number(e.target.value) })
                }
              />

              <label className="form-label mt-1">Upload ảnh thumbnail</label>
              <input
                type="file"
                className="form-control mb-2"
                onChange={handleFile}
              />
              {uploading && (
                <div className="small text-muted mb-2">Đang upload...</div>
              )}
              {form.thumbnail && (
                <div className="mb-2">
                  <img
                    src={form.thumbnail}
                    alt="preview"
                    style={{ width: 80, height: 80, objectFit: "cover" }}
                    className="rounded border"
                  />
                </div>
              )}

              <input
                className="form-control mb-2"
                placeholder="Ảnh thumbnail (URL) – nếu không upload"
                value={form.thumbnail}
                onChange={(e) =>
                  setForm({ ...form, thumbnail: e.target.value })
                }
              />

              <textarea
                className="form-control mb-2"
                rows={3}
                placeholder="Danh sách URL ảnh, mỗi dòng 1 ảnh"
                value={form.imagesText}
                onChange={(e) =>
                  setForm({ ...form, imagesText: e.target.value })
                }
              />

              <button className="btn btn-primary w-100 mt-1">
                {editId ? "Cập nhật" : "Thêm mới"}
              </button>
              {editId && (
                <button
                  type="button"
                  className="btn btn-outline-secondary w-100 mt-2"
                  onClick={() => {
                    setEditId(null);
                    setForm(emptyForm);
                  }}
                >
                  Hủy chỉnh sửa
                </button>
              )}
            </form>
          </div>
        </div>

        <div className="col-md-8">
          <div className="bg-white rounded-3 shadow-sm p-3">
            <h6 className="mb-3">Danh sách sản phẩm</h6>
            <table className="table table-sm align-middle mb-0">
              <thead>
                <tr>
                  <th>Ảnh</th>
                  <th>Tên</th>
                  <th>Danh mục</th>
                  <th>Giá</th>
                  <th>Tồn</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {list.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <img
                        src={p.thumbnail || p.images?.[0]}
                        alt=""
                        width={40}
                        height={40}
                        style={{ objectFit: "cover" }}
                        className="rounded"
                      />
                    </td>
                    <td>{p.name}</td>
                    <td>{p.categorySlug}</td>
                    <td>{p.price.toLocaleString()} đ</td>
                    <td>{p.stock}</td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-secondary me-1"
                        onClick={() => edit(p)}
                      >
                        Sửa
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => remove(p._id)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
                {list.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center small text-muted">
                      Chưa có sản phẩm nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
