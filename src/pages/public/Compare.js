import { Link } from "react-router-dom";
import { useCompare } from "../../context/CompareContext";
import { useCart } from "../../context/CartContext";
// --- SỬA LỖI TẠI ĐÂY: Thêm FiLayers vào danh sách import ---
import { FiX, FiShoppingCart, FiAlertCircle, FiLayers } from "react-icons/fi";
import { getImageUrl } from "../../utils/constants";

export default function Compare() {
  const { compareList, removeFromCompare } = useCompare();
  const { addToCart } = useCart();

  if (compareList.length === 0) {
    return (
      <div className="container py-5 text-center min-vh-100 d-flex flex-column justify-content-center align-items-center">
        <div className="mb-4 text-muted opacity-25"><FiLayers size={80} /></div>
        <h3 className="fw-bold">Danh sách so sánh trống</h3>
        <p className="text-muted">Hãy thêm sản phẩm để bắt đầu so sánh.</p>
        <Link to="/products" className="btn btn-primary rounded-pill px-4">Xem sản phẩm</Link>
      </div>
    );
  }

  // Lấy tất cả các keys thông số kỹ thuật (specs) của các sản phẩm để tạo hàng so sánh
  const allSpecKeys = new Set();
  compareList.forEach(p => {
    if (p.specs) Object.keys(p.specs).forEach(key => allSpecKeys.add(key));
  });
  const specKeys = Array.from(allSpecKeys);

  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container">
        <h3 className="fw-bold mb-4">So sánh sản phẩm</h3>
        
        <div className="table-responsive bg-white rounded-3 shadow-sm p-4">
          <table className="table table-borderless text-center align-middle mb-0">
            <thead>
              <tr>
                <th className="text-start" style={{width: '20%'}}>Thông tin</th>
                {compareList.map(p => (
                  <th key={p._id} style={{width: `${80 / compareList.length}%`}} className="position-relative">
                    <button 
                        className="btn btn-sm btn-light text-danger position-absolute top-0 end-0 m-1 rounded-circle"
                        onClick={() => removeFromCompare(p._id)}
                    >
                        <FiX />
                    </button>
                    <Link to={`/products/${p.slug}`} className="d-block mb-2">
                        <img 
                            src={getImageUrl(p.thumbnail || p.images?.[0])} 
                            alt={p.name} 
                            style={{height: 150, objectFit: 'contain'}} 
                            className="img-fluid"
                        />
                    </Link>
                    <Link to={`/products/${p.slug}`} className="text-decoration-none text-dark fw-bold d-block text-truncate-2 mb-2" style={{minHeight: 48}}>
                        {p.name}
                    </Link>
                    <div className="text-danger fw-bold fs-5 mb-2">{p.price.toLocaleString()}đ</div>
                    <button className="btn btn-primary btn-sm w-100 d-flex align-items-center justify-content-center gap-1" onClick={() => addToCart(p)}>
                        <FiShoppingCart/> Thêm vào giỏ
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Thương hiệu */}
              <tr className="border-top bg-light">
                <td className="text-start fw-bold p-3">Thương hiệu</td>
                {compareList.map(p => <td key={p._id} className="p-3">{p.brand}</td>)}
              </tr>

              {/* Thông số kỹ thuật động */}
              {specKeys.map(key => (
                <tr key={key} className="border-top">
                  <td className="text-start fw-medium p-3 text-secondary">{key}</td>
                  {compareList.map(p => (
                    <td key={p._id} className="p-3">
                      {p.specs && p.specs[key] ? (
                        <span className="fw-medium text-dark">{p.specs[key]}</span>
                      ) : (
                        <span className="text-muted small">-</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Trạng thái */}
              <tr className="border-top">
                <td className="text-start fw-bold p-3">Tình trạng</td>
                {compareList.map(p => (
                    <td key={p._id} className="p-3">
                        {p.stock > 0 ? <span className="text-success fw-bold">Còn hàng</span> : <span className="text-danger fw-bold">Hết hàng</span>}
                    </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <style>{`
        .text-truncate-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
}