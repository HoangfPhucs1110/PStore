import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function AdminProducts() {
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  const load = () => {
    api.get("/products").then((res) => setList(res.data));
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) return;
    await api.delete(`/products/${id}`);
    load();
  };

  return (
    <div className="container my-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Quản lý sản phẩm</h3>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => navigate("/admin/products/new")}
        >
          + Thêm sản phẩm
        </button>
      </div>

      <div className="bg-white rounded-3 shadow-sm p-3">
        <h6 className="mb-3">Danh sách sản phẩm</h6>
        <div className="table-responsive">
          <table className="table table-sm align-middle mb-0">
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tên</th>
                <th>Danh mục</th>
                <th>Giá</th>
                <th>Tồn</th>
                <th style={{ width: 150 }}></th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p._id}>
                  <td>
                    <img
                      src={p.thumbnail || p.images?.[0]}
                      alt={p.name}
                      width={48}
                      height={48}
                      style={{ objectFit: "cover" }}
                      className="rounded border"
                    />
                  </td>
                  <td>{p.name}</td>
                  <td>{p.categorySlug}</td>
                  <td>{p.price?.toLocaleString()} đ</td>
                  <td>{p.stock}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-secondary me-2"
                      onClick={() =>
                        navigate(`/admin/products/${p._id}/edit`)
                      }
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
  );
}
