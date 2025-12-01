import { useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { contactService } from "../../services/contactService";
import { useNotification } from "../../context/NotificationContext";
import { FiTrash2, FiMessageSquare, FiRefreshCw, FiCheckCircle, FiClock, FiSend, FiMail } from "react-icons/fi";

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { confirm, notify } = useNotification();
  
  // State cho Modal trả lời
  const [selectedContact, setSelectedContact] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [sending, setSending] = useState(false);

  const load = () => {
    setLoading(true);
    contactService.getAll()
      .then(setContacts)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = (id) => {
    confirm("Bạn có chắc muốn xóa liên hệ này?", async () => {
      try {
        await contactService.delete(id);
        notify("Đã xóa thành công", "success");
        load();
      } catch {
        notify("Lỗi khi xóa", "error");
      }
    });
  };

  const handleOpenReply = (contact) => {
    setSelectedContact(contact);
    setReplyMessage(""); // Reset nội dung mỗi khi mở
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) return notify("Vui lòng nhập nội dung trả lời", "warning");
    
    setSending(true);
    try {
        await contactService.reply(selectedContact._id, replyMessage);
        notify("Đã gửi phản hồi qua email thành công!", "success");
        setSelectedContact(null);
        load(); // Tải lại để cập nhật trạng thái đã trả lời
    } catch (err) {
        notify("Gửi phản hồi thất bại", "error");
    } finally {
        setSending(false);
    }
  };

  return (
    <div className="d-flex bg-light min-vh-100">
      <AdminSidebar />
      <div className="flex-grow-1 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold m-0 text-dark">Quản lý Liên hệ & Phản hồi</h4>
            <button className="btn btn-light btn-sm shadow-sm border" onClick={load}>
                <FiRefreshCw className="me-2"/> Tải lại
            </button>
        </div>
        
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="card-header bg-white py-3 border-bottom-0">
            <h6 className="m-0 fw-bold text-primary d-flex align-items-center gap-2">
                <FiMail /> Danh sách yêu cầu ({contacts.length})
            </h6>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Người gửi</th>
                  <th>Chủ đề</th>
                  <th>Nội dung</th>
                  <th>Trạng thái</th>
                  <th>Ngày gửi</th>
                  <th className="text-end pe-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-5 text-muted">Đang tải dữ liệu...</td></tr>
                ) : contacts.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-5 text-muted">Chưa có liên hệ nào.</td></tr>
                ) : contacts.map((c) => (
                  <tr key={c._id}>
                    <td className="ps-4">
                      <div className="fw-bold text-dark">{c.name}</div>
                      <div className="small text-muted">{c.email}</div>
                    </td>
                    <td><span className="badge bg-light text-dark border fw-normal">{c.subject}</span></td>
                    <td>
                        <div className="text-truncate text-secondary" style={{maxWidth: 250}} title={c.message}>
                            {c.message}
                        </div>
                    </td>
                    <td>
                      {c.status === "replied" ? (
                        <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3">
                            <FiCheckCircle className="me-1"/> Đã trả lời
                        </span>
                      ) : (
                        <span className="badge bg-warning-subtle text-warning border border-warning-subtle rounded-pill px-3">
                            <FiClock className="me-1"/> Chờ xử lý
                        </span>
                      )}
                    </td>
                    <td className="text-muted small">
                      {new Date(c.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="text-end pe-4">
                      <button 
                        className={`btn btn-sm me-2 rounded-pill px-3 fw-medium ${c.status === 'replied' ? 'btn-outline-secondary' : 'btn-primary'}`}
                        onClick={() => handleOpenReply(c)} 
                        title="Trả lời"
                      >
                          <FiMessageSquare className="me-1" /> {c.status === 'replied' ? 'Xem lại' : 'Trả lời'}
                      </button>
                      <button className="btn btn-light text-danger btn-sm rounded-circle p-2" onClick={() => handleDelete(c._id)} title="Xóa">
                          <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL TRẢ LỜI */}
      {selectedContact && (
        <div className="modal d-block" style={{backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050}}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content border-0 shadow rounded-4 overflow-hidden">
                    <div className="modal-header bg-primary text-white p-4">
                        <h5 className="modal-title fw-bold">
                            {selectedContact.status === 'replied' ? 'Chi tiết phản hồi' : 'Phản hồi liên hệ'}
                        </h5>
                        <button className="btn-close btn-close-white" onClick={() => setSelectedContact(null)}></button>
                    </div>
                    <div className="modal-body p-4">
                        {/* Thông tin người gửi */}
                        <div className="bg-light p-3 rounded-3 mb-4 border">
                            <div className="d-flex justify-content-between mb-2">
                                <div>
                                    <span className="text-muted small text-uppercase fw-bold">Người gửi:</span>
                                    <span className="ms-2 fw-bold text-dark">{selectedContact.name}</span>
                                </div>
                                <span className="text-muted small">{selectedContact.email}</span>
                            </div>
                            <div className="mb-2">
                                <span className="text-muted small text-uppercase fw-bold">Chủ đề:</span>
                                <span className="ms-2 text-primary fw-medium">{selectedContact.subject}</span>
                            </div>
                            <div className="p-3 bg-white rounded border text-secondary fst-italic">
                                "{selectedContact.message}"
                            </div>
                        </div>

                        {/* Khu vực trả lời */}
                        {selectedContact.status === 'replied' ? (
                            <div className="alert alert-success border-0 shadow-sm">
                                <div className="d-flex align-items-center gap-2 mb-2 text-success fw-bold">
                                    <FiCheckCircle /> Đã phản hồi vào: {new Date(selectedContact.repliedAt).toLocaleString("vi-VN")}
                                </div>
                                <hr className="my-2"/>
                                <p className="mb-0 text-dark" style={{whiteSpace: 'pre-line'}}>{selectedContact.replyMessage}</p>
                            </div>
                        ) : (
                            <div className="mb-3">
                                <label className="form-label fw-bold text-dark">Nội dung trả lời (Sẽ gửi qua Email)</label>
                                <textarea 
                                    className="form-control" 
                                    rows="6" 
                                    placeholder="Nhập nội dung phản hồi tại đây..."
                                    value={replyMessage}
                                    onChange={e => setReplyMessage(e.target.value)}
                                    autoFocus
                                ></textarea>
                            </div>
                        )}
                    </div>
                    <div className="modal-footer bg-light p-3">
                        <button className="btn btn-light fw-medium px-4 rounded-pill" onClick={() => setSelectedContact(null)}>Đóng</button>
                        {selectedContact.status !== 'replied' && (
                            <button className="btn btn-primary d-flex align-items-center gap-2 px-4 rounded-pill fw-bold shadow-sm" onClick={handleSendReply} disabled={sending}>
                                {sending ? <span className="spinner-border spinner-border-sm"></span> : <FiSend />} 
                                {sending ? "Đang gửi..." : "Gửi phản hồi"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}