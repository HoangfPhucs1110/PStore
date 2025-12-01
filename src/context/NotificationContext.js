import { createContext, useContext, useState, useCallback } from "react";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from "react-icons/fi";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  // --- STATE CHO DIALOG (Modal xác nhận/thông báo) ---
  const [dialog, setDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Đồng ý",
    cancelText: "Hủy",
    isAlert: false, // Nếu true thì chỉ hiện nút Đóng
    onConfirm: null,
  });

  // --- STATE CHO TOAST (Thông báo góc màn hình) ---
  const [toasts, setToasts] = useState([]);

  // --- HÀM XỬ LÝ DIALOG ---
  const closeDialog = () => setDialog((prev) => ({ ...prev, isOpen: false }));

  const confirm = (message, onConfirm, title = "Xác nhận") => {
    setDialog({
      isOpen: true,
      title,
      message,
      confirmText: "Đồng ý",
      cancelText: "Hủy",
      isAlert: false,
      onConfirm: async () => {
        if (onConfirm) await onConfirm();
        closeDialog();
      },
    });
  };

  const alert = (message, title = "Thông báo") => {
    setDialog({
      isOpen: true,
      title,
      message,
      confirmText: "Đóng",
      isAlert: true,
      onConfirm: closeDialog,
    });
  };

  // --- HÀM XỬ LÝ TOAST ---
  const notify = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Tự động tắt sau 3 giây
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ confirm, alert, notify }}>
      {children}

      {/* RENDER DIALOG TOÀN CỤC */}
      <ConfirmDialog
        show={dialog.isOpen}
        title={dialog.title}
        message={dialog.message}
        confirmText={dialog.confirmText}
        cancelText={dialog.cancelText}
        onConfirm={dialog.onConfirm}
        onCancel={closeDialog}
        isAlert={dialog.isAlert} // Bạn cần update ConfirmDialog để nhận prop này
      />

      {/* RENDER TOAST CONTAINER */}
      <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 9999 }}>
        {toasts.map((t) => (
          <div 
            key={t.id} 
            className={`toast show align-items-center text-white bg-${t.type === 'error' ? 'danger' : t.type === 'warning' ? 'warning' : 'success'} border-0 mb-2`}
            role="alert"
            style={{minWidth: 250}}
          >
            <div className="d-flex">
              <div className="toast-body d-flex align-items-center gap-2">
                {t.type === 'error' ? <FiAlertCircle size={20}/> : <FiCheckCircle size={20}/>}
                <span className="fw-medium">{t.message}</span>
              </div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => removeToast(t.id)}></button>
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext);