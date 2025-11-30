import { useEffect, useState } from "react";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";
import { FaStar, FaTrash } from "react-icons/fa";

export default function ProductReviews({ productId }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  // Build đúng avatar URL
  const buildAvatarUrl = (u = {}) => {
    const raw = u.avatar || u.avatarUrl || u.photo || u.image;
    if (!raw) return null;

    if (raw.startsWith("http")) return raw;

    const base =
      process.env.REACT_APP_API_URL || "http://localhost:5000";

    return `${base}${raw.startsWith("/") ? "" : "/"}${raw}`;
  };

  // Load review
  const load = async () => {
    try {
      const { data } = await api.get(`/products/${productId}/reviews`);
      setReviews(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, [productId]);

  // Gửi đánh giá
  const submitReview = async () => {
    if (!user) return alert("Bạn phải đăng nhập để đánh giá.");

    try {
      setLoading(true);

      await api.post("/reviews", {
        productId,
        rating,
        comment,
      });

      setComment("");
      await load();
    } catch (err) {
      console.error(err);
      alert("Không gửi được đánh giá.");
    } finally {
      setLoading(false);
    }
  };

  // Xóa review
  const remove = async (id) => {
    if (!window.confirm("Xóa đánh giá này?")) return;

    try {
      await api.delete(`/reviews/${id}`);
      await load();
    } catch (err) {
      console.error(err);
      alert("Không xóa được đánh giá");
    }
  };

  return (
    <div className="mt-4">
      <h5 className="fw-bold mb-3">Đánh giá & bình luận</h5>

      {/* FORM */}
      <div className="p-3 bg-white rounded-3 border mb-3">
        <div className="mb-2">Chọn số sao</div>

        <div className="d-flex gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((s) => (
            <FaStar
              key={s}
              size={22}
              onClick={() => setRating(s)}
              style={{
                cursor: "pointer",
                color: s <= rating ? "#f4b400" : "#d9d9d9",
              }}
            />
          ))}
        </div>

        <textarea
          className="form-control mb-2"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Chia sẻ cảm nhận về sản phẩm..."
        />

        <button
          className="btn btn-primary"
          disabled={loading}
          onClick={submitReview}
        >
          Gửi đánh giá
        </button>
      </div>

      {/* DANH SÁCH REVIEW */}
      {reviews.map((r) => {
        const u = r.user || {};
        const avatarUrl = buildAvatarUrl(u);

        return (
          <div
            key={r._id}
            className="p-3 bg-white rounded-3 border mb-3"
          >
            <div className="d-flex justify-content-between">
              <div className="d-flex align-items-center gap-2">
                {/* Avatar */}
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={u.name}
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle bg-light"
                    style={{
                      width: 38,
                      height: 38,
                      fontSize: 13,
                      color: "#666",
                    }}
                  >
                    {u.name ? u.name[0].toUpperCase() : "?"}
                  </div>
                )}

                <div>
                  <div className="fw-semibold">{u.name}</div>

                  {/* sao */}
                  <div className="d-flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <FaStar
                        key={s}
                        size={15}
                        style={{
                          color: s <= r.rating ? "#f4b400" : "#ddd",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* nút xóa nếu là chủ review hoặc admin */}
              {(user?.role === "admin" ||
                user?._id === u._id) && (
                <FaTrash
                  size={16}
                  color="#d9534f"
                  style={{ cursor: "pointer" }}
                  onClick={() => remove(r._id)}
                />
              )}
            </div>

            <div className="mt-2">{r.comment}</div>

            <div className="text-muted small mt-1">
              {new Date(r.createdAt).toLocaleString("vi-VN")}
            </div>
          </div>
        );
      })}
    </div>
  );
}
