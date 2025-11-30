import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function SliderNavButton({ direction = "left", onClick }) {
  const Icon = direction === "left" ? FiChevronLeft : FiChevronRight;

  return (
    <button
      onClick={onClick}
      className="slider-nav-btn d-flex align-items-center justify-content-center"
    >
      <Icon size={22} />
    </button>
  );
}
