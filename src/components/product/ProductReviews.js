import { useEffect, useState } from "react";
import { reviewService } from "../../services/reviewService";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext"; // Import thêm notify
import { FaStar, FaTrash } from "react-icons/fa";
import { getImageUrl } from "../../utils/constants"; // Import để lấy ảnh avatar nếu cần

export default function ProductReviews({ productId }) {
  const { user } = useAuth();
  const { notify, confirm } = useNotification(); // Sử dụng hook thông báo
  
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false); // Thêm state loading khi gửi

  // Hàm tải đánh giá
  const loadReviews = async () => {
    try {
      const data = await reviewService.getByProduct(productId);
      setReviews(data || []);
    } catch (error) {
      console.error("Lỗi tải đánh giá:", error);
    }
  };

  useEffect(() => {
    if (productId) {
        loadReviews();
    }
  }, [productId]);

  // Xử lý gửi đánh giá
  const handleSubmit = async () => {
    if (!user) {
        notify("Vui lòng đăng nhập để đánh giá sản phẩm", "warning");
        return;
    }
    if (!comment.trim()) {
        notify("Vui lòng nhập nội dung đánh giá", "warning");
        return;
    }

    setSubmitting(true);
    try {
      await reviewService.create({ productId, rating, comment });
      notify("Gửi đánh giá thành công!", "success");
      setComment("");
      setRating(5);
      loadReviews(); // Tải lại danh sách ngay lập tức
    } catch (err) {
      notify(err.response?.data?.message || "Lỗi khi gửi đánh giá", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Xử lý xóa đánh giá
  const handleDelete = (id) => {
    confirm("Bạn có chắc chắn muốn xóa đánh giá này?", async () => {
        try {
            await reviewService.delete(id);
            notify("Đã xóa đánh giá", "success");
            loadReviews();
        } catch (error) {
            notify("Không thể xóa đánh giá", "error");
        }
    });
  };

  return (
    <div className="mt-4 p-4 bg-white rounded shadow-sm">
      <h5 className="fw-bold mb-3">Đánh giá sản phẩm ({reviews.length})</h5>
      
      {/* Form nhập đánh giá */}
      <div className="mb-4 border-bottom pb-3">
        <div className="mb-2">
          <span className="me-2 fw-medium">Chọn mức đánh giá:</span>
          {[1, 2, 3, 4, 5].map((s) => (
            <FaStar 
              key={s} 
              size={24} 
              color={s <= rating ? "#ffc107" : "#e4e5e9"} 
              style={{ cursor: "pointer", transition: "color 0.2s" }} 
              onClick={() => setRating(s)} 
              className="me-1"
            />
          ))}
        </div>
        
        <textarea 
            className="form-control mb-3" 
            rows="3" 
            placeholder="Mời bạn chia sẻ cảm nhận về sản phẩm..." 
            value={comment} 
            onChange={(e) => setComment(e.target.value)} 
        />
        
        <div className="text-end">
            <button 
                className="btn btn-primary px-4 fw-bold" 
                onClick={handleSubmit}
                disabled={submitting}
            >
                {submitting ? "Đang gửi..." : "Gửi đánh giá"}
            </button>
        </div>
      </div>

      {/* Danh sách đánh giá */}
      <div className="vstack gap-3">
        {reviews.length === 0 && (
            <p className="text-muted text-center py-3">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
        )}
        
        {reviews.map((r) => (
          <div key={r._id} className="border-bottom pb-3">
            <div className="d-flex justify-content-between align-items-start">
              <div className="d-flex gap-3">
                {/* Avatar User */}
                <div className="flex-shrink-0">
                    <img 
                        src={getImageUrl(r.user?.avatarUrl)} 
                        alt={r.user?.name} 
                        className="rounded-circle border"
                        width="40" height="40"
                        style={{objectFit: "cover"}}
                        onError={(e) => e.target.src = "https://placehold.co/40?text=U"}
                    />
                </div>
                
                <div>
                    <div className="fw-bold text-dark">{r.user?.name || "Người dùng ẩn danh"}</div>
                    <div className="d-flex text-warning mb-1" style={{fontSize: "0.85rem"}}>
                        {[...Array(5)].map((_, i) => (
                            <FaStar key={i} color={i < r.rating ? "#ffc107" : "#ddd"} />
                        ))}
                    </div>
                    <div className="text-secondary" style={{whiteSpace: "pre-wrap"}}>{r.comment}</div>
                    <small className="text-muted" style={{fontSize: "0.75rem"}}>
                        {new Date(r.createdAt).toLocaleString("vi-VN")}
                    </small>
                </div>
              </div>

              {/* Nút xóa (Chỉ hiện với chủ sở hữu hoặc Admin) */}
              {(user?._id === r.user?._id || user?.role === 'admin') && (
                <button 
                    className="btn btn-light btn-sm text-danger rounded-circle p-2" 
                    onClick={() => handleDelete(r._id)}
                    title="Xóa đánh giá này"
                >
                    <FaTrash />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}