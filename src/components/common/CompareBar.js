import { Link } from "react-router-dom";
import { useCompare } from "../../context/CompareContext";
import { FiX, FiLayers, FiArrowRight } from "react-icons/fi";
import { getImageUrl } from "../../utils/constants";

export default function CompareBar() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  if (compareList.length === 0) return null;

  return (
    <div className="fixed-bottom bg-white border-top shadow-lg p-3 animate-slide-up" style={{ zIndex: 1040 }}>
      <div className="container">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <h6 className="mb-0 fw-bold d-none d-md-block">So sánh ({compareList.length}/3)</h6>
            
            <div className="d-flex gap-2 overflow-auto">
              {compareList.map((p) => (
                <div key={p._id} className="position-relative border rounded p-1" style={{width: 60, height: 60}}>
                  <img 
                    src={getImageUrl(p.thumbnail || p.images?.[0])} 
                    className="w-100 h-100 object-fit-contain" 
                    alt={p.name}
                  />
                  <button 
                    className="btn btn-sm btn-dark position-absolute top-0 end-0 translate-middle rounded-circle p-0 d-flex align-items-center justify-content-center"
                    style={{width: 18, height: 18}}
                    onClick={() => removeFromCompare(p._id)}
                  >
                    <FiX size={10}/>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-light btn-sm text-muted" onClick={clearCompare}>Xóa tất cả</button>
            <Link to="/compare" className="btn btn-primary d-flex align-items-center gap-2 shadow-sm">
              <FiLayers /> <span className="d-none d-sm-inline">So sánh ngay</span> <FiArrowRight/>
            </Link>
          </div>
        </div>
      </div>
      <style>{`
        .animate-slide-up { animation: slideUp 0.3s ease-out; }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>
    </div>
  );
}