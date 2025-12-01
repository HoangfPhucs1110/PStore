export default function ConfirmDialog({ 
  show, title, message, onConfirm, onCancel, 
  confirmText = "Xóa", cancelText = "Hủy", isAlert = false 
}) {
  if (!show) return null;
  return (
    <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
      <div className="modal-dialog modal-dialog-centered modal-sm">
        <div className="modal-content border-0 shadow rounded-4 overflow-hidden">
          <div className="modal-header bg-light border-0 py-3">
            <h5 className="modal-title fw-bold text-dark">{title || "Thông báo"}</h5>
            <button className="btn-close" onClick={onCancel}></button>
          </div>
          <div className="modal-body py-4 text-center">
            <p className="mb-0 text-secondary">{message}</p>
          </div>
          <div className="modal-footer border-0 justify-content-center pb-4 pt-0">
            {!isAlert && (
              <button className="btn btn-light px-4 rounded-pill fw-medium" onClick={onCancel}>
                {cancelText}
              </button>
            )}
            <button className="btn btn-primary px-4 rounded-pill fw-bold" onClick={onConfirm}>
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}