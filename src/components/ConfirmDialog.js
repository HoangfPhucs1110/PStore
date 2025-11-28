import React from "react";

export default function ConfirmDialog({
  show,
  title = "Xác nhận",
  message,
  cancelText = "Không",
  confirmText = "Đồng ý",
  onCancel,
  onConfirm
}) {
  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 3000
      }}
    >
      <div
        style={{
          width: 380,
          background: "#fff",
          borderRadius: 10,
          padding: "20px 24px",
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)"
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            border: "3px solid #ff9800",
            color: "#ff9800",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 12px",
            fontSize: 28
          }}
        >
          ?
        </div>
        <h5 className="mb-2">{title}</h5>
        <p className="mb-4">{message}</p>

        <div className="d-flex gap-2">
          <button className="btn btn-light flex-fill" onClick={onCancel}>
            {cancelText}
          </button>
          <button className="btn btn-danger flex-fill" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
