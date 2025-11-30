export default function ProfileAddresses({
  addresses,
  editingAddress,
  saving,
  onFieldChange,
  onSave,
  onEdit,
  onDelete,
  onSetDefault
}) {
  return (
    <>
      <h5 className="mb-3">Địa chỉ giao hàng</h5>
      <p className="small text-muted">
        Thêm sẵn địa chỉ để chọn nhanh ở bước thanh toán.
      </p>

      <div className="row g-3">
        <div className="col-md-7">
          <div className="bg-light rounded-3 p-3">
            <h6 className="mb-2">
              {editingAddress.index >= 0 ? "Sửa địa chỉ" : "Thêm địa chỉ mới"}
            </h6>

            <div className="row g-2">
              <div className="col-md-4">
                <label className="form-label small mb-1">Tên gợi nhớ</label>
                <input
                  className="form-control form-control-sm"
                  value={editingAddress.label}
                  onChange={(e) => onFieldChange("label", e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label small mb-1">
                  Tên người nhận
                </label>
                <input
                  className="form-control form-control-sm"
                  value={editingAddress.fullName}
                  onChange={(e) => onFieldChange("fullName", e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label small mb-1">
                  Số điện thoại nhận hàng
                </label>
                <input
                  className="form-control form-control-sm"
                  value={editingAddress.phone}
                  onChange={(e) => onFieldChange("phone", e.target.value)}
                />
              </div>
              <div className="col-12">
                <label className="form-label small mb-1">
                  Địa chỉ chi tiết
                </label>
                <input
                  className="form-control form-control-sm"
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  value={editingAddress.address}
                  onChange={(e) => onFieldChange("address", e.target.value)}
                />
              </div>
              <div className="col-12 d-flex align-items-center mt-1">
                <input
                  type="checkbox"
                  className="form-check-input me-2"
                  id="addr-default"
                  checked={editingAddress.isDefault}
                  onChange={(e) => onFieldChange("isDefault", e.target.checked)}
                />
                <label
                  htmlFor="addr-default"
                  className="form-check-label small"
                >
                  Đặt làm địa chỉ mặc định
                </label>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-outline-primary btn-sm mt-3"
              onClick={onSave}
            >
              {editingAddress.index >= 0 ? "Cập nhật địa chỉ" : "Thêm địa chỉ"}
            </button>
          </div>
        </div>

        <div className="col-md-5">
          <div className="vstack gap-2">
            {addresses.map((addr, idx) => (
              <div
                key={idx}
                className="address-item d-flex justify-content-between align-items-start"
              >
                <div>
                  <div className="fw-semibold small">
                    {addr.label ? `[${addr.label}] ` : ""}
                    {addr.fullName} – {addr.phone}
                    {addr.isDefault && (
                      <span className="badge bg-primary ms-2">Mặc định</span>
                    )}
                  </div>
                  <div className="small text-muted">{addr.address}</div>
                </div>
                <div className="d-flex flex-column gap-1 address-actions">
                  {!addr.isDefault && (
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm px-3 py-1"
                      onClick={() => onSetDefault(idx)}
                    >
                      Đặt mặc định
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => onEdit(idx)}
                  >
                    Sửa
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => onDelete(idx)}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <button
              className="btn btn-primary"
              type="button"
              disabled={saving}
              onClick={onSave}
            >
              {saving ? "Đang lưu..." : "Lưu thay đổi địa chỉ"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
