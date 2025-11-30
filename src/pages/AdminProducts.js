import { useEffect, useMemo, useState } from "react";
import api from "../api";
import ConfirmDialog from "../components/ConfirmDialog";
import AdminProductFilters from "../components/admin/AdminProductFilters";
import AdminProductTable from "../components/admin/AdminProductTable";

export default function AdminProducts() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterBrand, setFilterBrand] = useState("all");

  const [showDelete, setShowDelete] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/products");
      setList(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Không tải được danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const categories = useMemo(() => {
    const set = new Set(list.map((p) => p.categorySlug).filter(Boolean));
    return Array.from(set);
  }, [list]);

  const brands = useMemo(() => {
    const set = new Set(list.map((p) => p.brand).filter(Boolean));
    return Array.from(set);
  }, [list]);

  const filtered = useMemo(() => {
    return list.filter((p) => {
      if (
        search &&
        !p.name.toLowerCase().includes(search.toLowerCase()) &&
        !p.sku?.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      if (filterCategory !== "all" && p.categorySlug !== filterCategory)
        return false;
      if (filterBrand !== "all" && p.brand !== filterBrand) return false;
      return true;
    });
  }, [list, search, filterCategory, filterBrand]);

  const toggleFeatured = async (id, current) => {
    try {
      await api.put(`/products/${id}`, { isFeatured: !current });
      setList((prev) =>
        prev.map((p) => (p._id === id ? { ...p, isFeatured: !current } : p))
      );
    } catch (err) {
      console.error(err);
      alert("Không cập nhật được trạng thái nổi bật");
    }
  };

  const askDelete = (id) => {
    setDeletingId(id);
    setShowDelete(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await api.delete(`/products/${deletingId}`);
      setList((prev) => prev.filter((p) => p._id !== deletingId));
    } catch (err) {
      console.error(err);
      alert("Xóa thất bại");
    } finally {
      setDeletingId(null);
      setShowDelete(false);
    }
  };

  return (
    <div className="container py-4">
      <AdminProductFilters
        search={search}
        setSearch={setSearch}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        filterBrand={filterBrand}
        setFilterBrand={setFilterBrand}
        categories={categories}
        brands={brands}
        onReset={() => {
          setSearch("");
          setFilterCategory("all");
          setFilterBrand("all");
        }}
        onReload={load}
      />

      <AdminProductTable
        products={filtered}
        loading={loading}
        onToggleFeatured={toggleFeatured}
        onAskDelete={askDelete}
      />

      <ConfirmDialog
        show={showDelete}
        title="Xác nhận xóa"
        message="Bạn có chắc muốn xóa sản phẩm này?"
        confirmText="Xóa"
        cancelText="Hủy"
        onCancel={() => {
          setShowDelete(false);
          setDeletingId(null);
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
