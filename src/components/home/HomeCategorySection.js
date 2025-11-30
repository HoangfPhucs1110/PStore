import { useEffect, useMemo, useState } from "react";
import ProductCard from "../ProductCard";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function HomeCategorySection({ title, items = [], onViewAll }) {
  const list = Array.isArray(items) ? items : [];
  const [index, setIndex] = useState(0);

  const maxShow = 6;
  const hasSlider = list.length > maxShow;

  const visible = useMemo(() => {
    if (!list.length) return [];
    const show = Math.min(maxShow, list.length);
    const arr = [];
    for (let i = 0; i < show; i++) {
      arr.push(list[(index + i) % list.length]);
    }
    return arr;
  }, [list, index]);

  const next = () => setIndex((i) => (i + 1) % list.length);
  const prev = () => setIndex((i) => (i - 1 + list.length) % list.length);

  useEffect(() => {
    if (!hasSlider) return;
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [hasSlider]);

  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="mb-0">{title}</h5>
        <button
          className="btn btn-link small text-primary p-0"
          onClick={onViewAll}
        >
          Xem tất cả
        </button>
      </div>

      <div className="cat-wrapper position-relative bg-white rounded-3 shadow-sm p-3">
        {/* CSS chung (giống TrendingSlider) */}
        <style>{`
          .cat-wrapper { position: relative; }
          .slider-btn {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 44px;
            height: 44px;
            border-radius: 50%;
            border: none;
            background: #fff;
            color: #333;
            box-shadow: 0 2px 6px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: 0.2s;
            z-index: 20;
          }
          .slider-btn:hover {
            background: #007bff;
            color: #fff;
          }
          .slider-left { left: -18px; }
          .slider-right { right: -18px; }
        `}</style>

        {hasSlider && (
          <button className="slider-btn slider-left" onClick={prev}>
            <FiChevronLeft size={22} />
          </button>
        )}

        <div
          className="row g-3 flex-nowrap"
          style={{ overflow: hasSlider ? "hidden" : "visible" }}
        >
          {visible.map((p) => (
            <div
              key={p._id}
              className="col-6 col-md-4 col-xl-2"
              style={hasSlider ? { minWidth: "16.66%" } : {}}
            >
              <ProductCard p={p} />
            </div>
          ))}
        </div>

        {hasSlider && (
          <button className="slider-btn slider-right" onClick={next}>
            <FiChevronRight size={22} />
          </button>
        )}
      </div>
    </div>
  );
}
