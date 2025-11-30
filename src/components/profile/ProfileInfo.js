export default function ProfileInfo({
  profile,
  user,
  avatarUrl,
  saving,
  avatarUploading,
  onChange,
  onSave,
  onAvatarClick
}) {
  const displayName = profile.name || user.name || "Người dùng";
  const email = user.email;

  return (
    <>
      <h5 className="mb-3">Thông tin tài khoản</h5>
      <div className="row g-3">
        <div className="col-md-8">
          <div className="mb-3">
            <label className="form-label">Họ tên</label>
            <input
              className="form-control"
              value={profile.name}
              onChange={(e) => onChange("name", e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input className="form-control" value={email} disabled />
          </div>
          <div className="mb-3">
            <label className="form-label">Số điện thoại</label>
            <input
              className="form-control"
              value={profile.phone}
              onChange={(e) => onChange("phone", e.target.value)}
            />
          </div>
          <button
            className="btn btn-primary"
            type="button"
            disabled={saving}
            onClick={onSave}
          >
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>

        <div className="col-md-4 d-flex flex-column align-items-center">
          <div
            className="rounded-circle mb-2 border position-relative"
            style={{
              width: 96,
              height: 96,
              background: "#e5f0ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              fontSize: 36,
              fontWeight: 700,
              color: "#0d6efd",
              cursor: "pointer"
            }}
            onClick={onAvatarClick}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/96?text=Avatar";
                }}
              />
            ) : (
              displayName.charAt(0).toUpperCase()
            )}
          </div>
          <div className="fw-semibold">{displayName}</div>
          <div className="small text-muted mb-1">{email}</div>
          <div className="small text-primary">
            {avatarUploading ? "Đang tải ảnh..." : "Nhấn vào ảnh để đổi ảnh"}
          </div>
        </div>
      </div>
    </>
  );
}
