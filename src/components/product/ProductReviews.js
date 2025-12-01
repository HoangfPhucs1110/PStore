import { useEffect, useState } from "react";
import { reviewService } from "../../services/reviewService"; // Import service mới
import { useAuth } from "../../context/AuthContext";
import { FaStar, FaTrash } from "react-icons/fa";

export default function ProductReviews({ productId }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const loadReviews = async () => {
    try {
      const data = await reviewService.getByProduct(productId);
      setReviews(data);
    } catch (error) { console.error(error); }
  };

  useEffect(() => { loadReviews(); }, [productId]);

  const handleSubmit = async () => {
    if (!user) return alert("Vui lòng đăng nhập");
    try {
      await reviewService.create({ productId, rating, comment });
      setComment("");
      loadReviews();
    } catch (err) { alert("Lỗi gửi đánh giá"); }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Xóa?")) {
        await reviewService.delete(id);
        loadReviews();
    }
  }

  return (
    <div className="mt-4 p-4 bg-white rounded shadow-sm">
      <h5 className="fw-bold mb-3">Đánh giá sản phẩm</h5>
      
      {/* Form */}
      <div className="mb-4 border-bottom pb-3">
        <div className="mb-2">
          {[1,2,3,4,5].map(s => (
            <FaStar key={s} size={24} 
              color={s <= rating ? "#ffc107" : "#e4e5e9"} 
              style={{cursor: "pointer"}} onClick={() => setRating(s)} 
            />
          ))}
        </div>
        <textarea className="form-control mb-2" rows="3" placeholder="Viết đánh giá..." 
          value={comment} onChange={e => setComment(e.target.value)} />
        <button className="btn btn-primary" onClick={handleSubmit}>Gửi đánh giá</button>
      </div>

      {/* List */}
      {reviews.map(r => (
        <div key={r._id} className="mb-3 border-bottom pb-2">
          <div className="d-flex justify-content-between">
            <div className="d-flex align-items-center gap-2">
                <strong>{r.user?.name}</strong>
                <div className="text-warning d-flex">
                    {[...Array(5)].map((_, i) => <FaStar key={i} size={12} color={i < r.rating ? "#ffc107" : "#ddd"} />)}
                </div>
            </div>
            {(user?._id === r.user?._id || user?.role === 'admin') && 
                <button className="btn btn-link text-danger p-0" onClick={() => handleDelete(r._id)}><FaTrash/></button>
            }
          </div>
          <p className="mb-1 mt-1">{r.comment}</p>
          <small className="text-muted">{new Date(r.createdAt).toLocaleDateString()}</small>
        </div>
      ))}
    </div>
  );
}