// Lấy URL từ biến môi trường, lưu ý bỏ /api ở cuối nếu biến môi trường có
const BASE_URL = process.env.REACT_APP_API_URL 
  ? process.env.REACT_APP_API_URL.replace('/api', '') 
  : "http://localhost:5000";

export const API_URL = BASE_URL;

export const getImageUrl = (imagePath) => {
  if (!imagePath || imagePath === "undefined" || imagePath === "null") {
      return "https://placehold.co/150x150?text=No+Image";
  }

  if (typeof imagePath === 'object') {
      return imagePath.url || "https://via.placeholder.com/150?text=Error";
  }

  const path = String(imagePath).trim();

  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:image")) {
      return path;
  }
  
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  return `${API_URL}/${cleanPath}`;
};