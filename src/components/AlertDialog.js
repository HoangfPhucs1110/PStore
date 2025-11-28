import React from "react";

export default function AlertDialog({
  show,
  title = "Thông báo",
  message,
  buttonText = "Đóng",
  onClose
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
          width: 360,
          background: "#fff",
          borderRadius: 10,
          padding: "20px 24px",
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)"
        }}
      >
        <div
          style={{
            fontSize: 40,
            color: "#00c853",
            marginBottom: 8
          }}
        >
          ✓
        </div>
        <h5 className="mb-2">{title}</h5>
        <p className="mb-4">{message}</p>
        <button className="btn btn-primary w-100" onClick={onClose}>
          {buttonText}
        </button>
      </div>
    </div>
  );
}
