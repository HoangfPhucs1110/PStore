import { FiUser, FiMapPin, FiPackage } from "react-icons/fi";

export default function ProfileSidebar({
  name,
  email,
  avatarUrl,
  tab,
  setTab,
  onAvatarClick
}) {
  const firstChar = (name || email || "U").charAt(0).toUpperCase();

  return (
    <div className="d-flex flex-column gap-3">
      <div className="card shadow-sm border-0">
        <div className="card-body d-flex align-items-center">
          <div
            className="me-3"
            style={{ cursor: "pointer" }}
            onClick={onAvatarClick}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="profile-avatar"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/56?text=U";
                }}
              />
            ) : (
              <div
                className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                style={{ width: 56, height: 56, fontSize: 20 }}
              >
                {firstChar}
              </div>
            )}
          </div>
          <div>
            <div className="fw-semibold">{name}</div>
            <div className="small text-muted">{email}</div>
            <div className="small text-primary">Nhấn vào ảnh để đổi ảnh</div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="list-group list-group-flush">
          <button
            type="button"
            className={
              "list-group-item list-group-item-action " +
              (tab === "info" ? "active" : "")
            }
            onClick={() => setTab("info")}
          >
            <FiUser className="me-2" />
            Thông tin tài khoản
          </button>
          <button
            type="button"
            className={
              "list-group-item list-group-item-action " +
              (tab === "addresses" ? "active" : "")
            }
            onClick={() => setTab("addresses")}
          >
            <FiMapPin className="me-2" />
            Địa chỉ giao hàng
          </button>
          <button
            type="button"
            className={
              "list-group-item list-group-item-action " +
              (tab === "orders" ? "active" : "")
            }
            onClick={() => setTab("orders")}
          >
            <FiPackage className="me-2" />
            Quản lý đơn hàng
          </button>
        </div>
      </div>
    </div>
  );
}
