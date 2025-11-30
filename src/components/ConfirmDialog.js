export default function ConfirmDialog({
  show,
  title = "Thông báo",
  message = "",
  confirmText = "Đồng ý",
  cancelText = "Hủy",
  onConfirm,
  onCancel
}) {
  if (!show) return null;

  const isAlert = !onConfirm || confirmText === cancelText;

  const handleClose = () => {
    if (onCancel) onCancel();
    else if (onConfirm) onConfirm();
  };

  return (
    <div
      className="modal fade show"
      style={{
        display: "block",
        background: "rgba(0,0,0,0.35)"
      }}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        style={{
          maxWidth: 380,        // 👉 thu nhỏ chiều ngang
          margin: "0 auto"
        }}
      >
        <div
          className="modal-content border-0"
          style={{
            borderRadius: 14,   // mềm hơn
            padding: "4px 4px 12px"
          }}
        >
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title" style={{ fontSize: 18 }}>
              {title}
            </h5>
          </div>

          <div className="modal-body" style={{ fontSize: 15 }}>
            {message}
          </div>

          <div
            className="modal-footer border-0 d-flex justify-content-center"
            style={{ paddingTop: 0 }}
          >
            {isAlert ? (
              <button
                className="btn btn-primary px-4 py-2"
                style={{
                  borderRadius: 8,
                  fontSize: 15,
                  minWidth: 110
                }}
                onClick={handleClose}
              >
                {confirmText || "Đóng"}
              </button>
            ) : (
              <>
                <button
                  className="btn btn-light px-4 py-2"
                  style={{
                    borderRadius: 8,
                    fontSize: 15,
                    minWidth: 100
                  }}
                  onClick={onCancel}
                >
                  {cancelText}
                </button>
                <button
                  className="btn btn-danger px-4 py-2"
                  style={{
                    borderRadius: 8,
                    fontSize: 15,
                    minWidth: 100
                  }}
                  onClick={onConfirm}
                >
                  {confirmText}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
