import { useEffect, useState } from "react";
import ProductCard from "../product/ProductCard"; // Đã sửa đường dẫn
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function TrendingSlider({ products = [] }) {
  const [index, setIndex] = useState(0);
  const maxShow = 4;
  
  if (!products.length) return null;

  const visibleProducts = [];
  for (let i = 0; i < Math.min(products.length, maxShow); i++) {
    visibleProducts.push(products[(index + i) % products.length]);
  }

  const next = () => setIndex((i) => (i + 1) % products.length);
  const prev = () => setIndex((i) => (i - 1 + products.length) % products.length);

  return (
    <div className="position-relative bg-white p-3 rounded shadow-sm">
      <div className="row g-2">
        {visibleProducts.map((p, i) => (
          <div key={`${p._id}-${i}`} className="col-3">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
      {products.length > maxShow && (
        <>
          <button onClick={prev} className="btn btn-light position-absolute top-50 start-0 translate-middle-y shadow-sm" style={{left: -15}}><FiChevronLeft/></button>
          <button onClick={next} className="btn btn-light position-absolute top-50 end-0 translate-middle-y shadow-sm" style={{right: -15}}><FiChevronRight/></button>
        </>
      )}
    </div>
  );
}