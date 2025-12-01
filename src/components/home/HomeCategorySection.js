import ProductCard from "../product/ProductCard";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";

// Import Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

// Import styles
import 'swiper/css';
import 'swiper/css/navigation';

export default function HomeCategorySection({ title, items = [], onViewAll }) {
  if (!items.length) return null;

  // Tạo tên class unique
  const safeTitle = title.replace(/[^a-zA-Z0-9]/g, "");
  const prevClass = `prev-${safeTitle}`;
  const nextClass = `next-${safeTitle}`;

  return (
    <div className="mb-5 position-relative home-swiper-section group-hover-container">
      <div className="d-flex justify-content-between align-items-center mb-2 px-1">
        <h4 className="fw-bold m-0 text-dark">{title}</h4>
        <button 
            className="btn btn-link text-decoration-none text-dark fw-medium p-0 d-flex align-items-center gap-1 hover-text-primary"
            onClick={onViewAll}
        >
            Xem tất cả <FiArrowRight />
        </button>
      </div>

      <div className="position-relative">
        
        {/* NÚT TRÁI (Dùng class CSS mới) */}
        <button className={`${prevClass} custom-nav-btn swiper-btn-prev`}>
            <FiChevronLeft size={24} />
        </button>

        {/* SWIPER */}
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={16}
          slidesPerView={2}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }}
          navigation={{
              prevEl: `.${prevClass}`,
              nextEl: `.${nextClass}`,
          }}
          breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
              1280: { slidesPerView: 5 },
          }}
        >
          {items.map((p) => (
              <SwiperSlide key={p._id}>
                  <ProductCard product={p} />
              </SwiperSlide>
          ))}
        </Swiper>

        {/* NÚT PHẢI (Dùng class CSS mới) */}
        <button className={`${nextClass} custom-nav-btn swiper-btn-next`}>
            <FiChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}