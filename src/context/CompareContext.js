import { createContext, useContext, useState, useEffect } from "react";
import { useNotification } from "./NotificationContext";

const CompareContext = createContext(null);

export function CompareProvider({ children }) {
  const [compareList, setCompareList] = useState([]);
  const { notify } = useNotification();

  // Load từ LocalStorage khi vào web
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("pstore_compare") || "[]");
    setCompareList(saved);
  }, []);

  // Lưu vào LocalStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem("pstore_compare", JSON.stringify(compareList));
  }, [compareList]);

  const addToCompare = (product) => {
    // 1. Kiểm tra đã tồn tại chưa
    if (compareList.find((p) => p._id === product._id)) {
      notify("Sản phẩm này đã có trong danh sách so sánh", "info");
      return;
    }

    // 2. Kiểm tra tối đa 3 sản phẩm
    if (compareList.length >= 3) {
      notify("Chỉ được so sánh tối đa 3 sản phẩm", "warning");
      return;
    }

    // 3. Kiểm tra cùng danh mục (Quan trọng: Không thể so sánh Chuột với Laptop)
    if (compareList.length > 0 && compareList[0].categorySlug !== product.categorySlug) {
      notify("Vui lòng so sánh các sản phẩm cùng loại (Danh mục)", "warning");
      return;
    }

    setCompareList((prev) => [...prev, product]);
    notify("Đã thêm vào so sánh", "success");
  };

  const removeFromCompare = (id) => {
    setCompareList((prev) => prev.filter((p) => p._id !== id));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  return (
    <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
}

export const useCompare = () => useContext(CompareContext);