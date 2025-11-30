import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function FeaturedSlider({ items }) {
  return (
    <Swiper
      modules={[Navigation, Autoplay]}
      navigation
      autoplay={{ delay: 2500 }}
      slidesPerView={6}
      spaceBetween={20}
      loop={true}
    >
      {items.map((p) => (
        <SwiperSlide key={p._id}>
          <ProductCard p={p} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
