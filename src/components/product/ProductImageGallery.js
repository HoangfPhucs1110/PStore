import { useState } from "react";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";

export default function ProductImageGallery({ images = [] }) {
  const list = images.length ? images : ["/placeholder.png"];
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const prev = () => setIndex((i) => (i - 1 + list.length) % list.length);
  const next = () => setIndex((i) => (i + 1) % list.length);

  return (
    <>
      {/* CSS inline */}
      <style>{`
        .pg-main {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          background: #f5f5f7;
        }
        .pg-main img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          cursor: zoom-in;
        }
        .pg-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,0.95);
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 5;
        }
        .pg-nav-btn:hover {
          background: #007bff;
          color: #fff;
        }
        .pg-left { left: 10px; }
        .pg-right { right: 10px; }

        .pg-thumbs img {
          border-radius: 10px;
          border: 2px solid transparent;
          cursor: pointer;
          transition: 0.2s;
        }
        .pg-thumbs img.pg-active {
          border-color: #007bff;
          background: #eef4ff;
        }

        .pg-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.65);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1050;
        }
        .pg-modal-inner {
          max-width: 900px;
          width: 100%;
          padding: 16px;
        }
        .pg-modal-img {
          max-height: 70vh;
          width: 100%;
          border-radius: 16px;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .pg-modal-img img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
      `}</style>

      {/* Ảnh lớn */}
      <div className="pg-main mb-3" style={{ height: 360 }}>
        <img src={list[index]} alt="" onClick={() => setOpen(true)} />

        {list.length > 1 && (
          <>
            <button className="pg-nav-btn pg-left" onClick={prev}>
              <FiChevronLeft />
            </button>
            <button className="pg-nav-btn pg-right" onClick={next}>
              <FiChevronRight />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail */}
      {list.length > 1 && (
        <div className="d-flex gap-2 pg-thumbs">
          {list.map((img, i) => (
            <div
              key={img + i}
              style={{ width: 64, height: 64, background: "#f5f5f7" }}
            >
              <img
                src={img}
                alt=""
                className={
                  "w-100 h-100 " + (i === index ? "pg-active" : "")
                }
                style={{ objectFit: "cover" }}
                onClick={() => setIndex(i)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Modal xem lớn */}
      {open && (
        <div className="pg-modal-backdrop" onClick={() => setOpen(false)}>
          <div
            className="pg-modal-inner"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-end mb-2">
              <button
                className="btn btn-light btn-sm d-flex align-items-center gap-1"
                onClick={() => setOpen(false)}
              >
                <FiX /> Đóng
              </button>
            </div>
            <div className="pg-modal-img mb-2">
              <img src={list[index]} alt="" />
            </div>
            {list.length > 1 && (
              <div className="d-flex gap-2 pg-thumbs justify-content-center">
                {list.map((img, i) => (
                  <div
                    key={img + "modal" + i}
                    style={{
                      width: 72,
                      height: 72,
                      background: "#f5f5f7"
                    }}
                  >
                    <img
                      src={img}
                      alt=""
                      className={
                        "w-100 h-100 " + (i === index ? "pg-active" : "")
                      }
                      style={{ objectFit: "cover" }}
                      onClick={() => setIndex(i)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
