import React from "react";

export default function ConfirmDialog({
  open,
  show,
  title = "Xác nhận",
  message,
  cancelText = "Không",
  confirmText = "Đồng ý",
  onCancel,
  onConfirm
}) {
  const visible = typeof open === "boolean" ? open : show;
  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        zIndex: 1050,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div
        className="bg-white rounded-3 shadow p-3"
        style={{ minWidth: 280, maxWidth: 420 }}
      >
        <h6 className="mb-2">{title}</h6>
        <p className="mb-4">{message}</p>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-light flex-fill"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className="btn btn-danger flex-fill"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
