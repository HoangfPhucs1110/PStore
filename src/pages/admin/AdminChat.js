import { useEffect, useState, useRef, useCallback } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import io from "socket.io-client";
import { FiSend, FiUser, FiMessageSquare } from "react-icons/fi";
import api from "../../api/api"; // Để fetch thông tin user

const ENDPOINT = "http://localhost:5000";

// Khởi tạo Socket Client (Phải đặt ngoài Component để không khởi tạo lại)
const socket = io(ENDPOINT, { autoConnect: false });

export default function AdminChat() {
  const [conversations, setConversations] = useState([]); 
  const [activeChat, setActiveChat] = useState(null); 
  const [messages, setMessages] = useState([]); 
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  // Hàm lấy thông tin user (tên, email) - Tạm thời dùng cache và gọi API
  const fetchUserDetails = useCallback(async (userId) => {
    try {
        const res = await api.get(`/auth/profile/${userId}`); // Giả định API /auth/profile/:id có tồn tại
        return { name: res.data.name, email: res.data.email };
    } catch {
        return { name: `Khách hàng ${userId.slice(-4)}`, email: "Không xác định" };
    }
  }, []);
  
  // --- SOCKET.IO LOGIC ---
  useEffect(() => {
    socket.connect();
    
    // Admin lắng nghe tin nhắn mới
    socket.on("new_unhandled_message", async (msg) => {
        const details = await fetchUserDetails(msg.senderId);

        setConversations(prev => {
            const isExist = prev.some(c => c.senderId === msg.senderId);
            const newConvo = { senderId: msg.senderId, name: details.name, email: details.email, lastMsg: msg.text, unread: true };
            if (!isExist) {
              return [newConvo, ...prev]; // Thêm mới lên đầu
            }
            return prev.map(c => c.senderId === msg.senderId ? newConvo : c); // Cập nhật tin nhắn cuối
        });

        // Nếu đang mở khung chat của user này, thêm tin nhắn vào
        if (activeChat && activeChat.senderId === msg.senderId) {
            setMessages(prev => [...prev, msg]);
        }
    });

    socket.on("receive_message", (msg) => {
        if (activeChat && activeChat.senderId === msg.senderId) {
            setMessages(prev => [...prev, msg]);
        }
    });

    // Tạm thời mock danh sách hội thoại ban đầu
    setConversations([
        { senderId: 'user_1234', name: 'Hoang Phuc', email: 'user@example.com', lastMsg: 'Xin chào, sản phẩm còn không ạ?' }
    ]);
    
    return () => {
      socket.off("new_unhandled_message");
      socket.off("receive_message");
      socket.disconnect(); // Tắt kết nối khi component unmount
    };
  }, [activeChat, fetchUserDetails]);


  // Hàm chọn user để chat
  const selectUser = async (convo) => {
    if (activeChat && activeChat.senderId === convo.senderId) return;
    
    // Tạm thời: Mock lịch sử chat
    setMessages([
        { senderId: 'admin', receiverId: convo.senderId, text: 'Xin chào, PStore có thể giúp gì cho bạn?', isAdminMsg: true, timestamp: Date.now() },
        { senderId: convo.senderId, receiverId: 'admin', text: convo.lastMsg, isAdminMsg: false, timestamp: Date.now() },
    ]);

    setActiveChat(convo);
    
    // Gửi tín hiệu join room (Admin cần join room của user để gửi lại)
    socket.emit("join_room", convo.senderId); 
  };

  const handleReply = (e) => {
    e.preventDefault();
    if (!text.trim() || !activeChat) return;

    const msgData = {
        senderId: "admin", 
        receiverId: activeChat.senderId,
        text: text,
        isAdminMsg: true,
        timestamp: new Date().toISOString()
    };

    socket.emit("send_message", msgData);
    setMessages(prev => [...prev, msgData]);
    setText("");
  };

  return (
    <div className="d-flex bg-light min-vh-100">
      <AdminSidebar />
      <div className="flex-grow-1 d-flex">
        
        {/* --- 1. Conversation List (Sidebar) --- */}
        <div className="bg-white border-end d-flex flex-column" style={{width: 300}}>
            <div className="p-3 border-bottom fw-bold text-primary">Hội thoại Khách hàng</div>
            <div className="flex-grow-1 overflow-auto">
                {conversations.map(c => (
                    <div 
                        key={c.senderId} 
                        className={`p-3 border-bottom cursor-pointer ${activeChat?.senderId === c.senderId ? 'bg-primary-subtle' : 'hover-bg-light'}`}
                        onClick={() => selectUser(c)}
                    >
                        <div className="fw-bold text-dark">{c.name}</div>
                        <div className="small text-muted text-truncate">{c.email}</div>
                        <div className="small mt-1 fst-italic text-secondary">{c.lastMsg}</div>
                    </div>
                ))}
            </div>
        </div>

        {/* --- 2. Chat Window (Right Panel) --- */}
        {/* Layout fix: Đặt chiều cao max-height và input cố định */}
        <div className="flex-grow-1 d-flex flex-column bg-white" style={{maxHeight: '100vh'}}>
            {activeChat ? (
                <>
                    {/* Header Chat Window */}
                    <div className="p-3 border-bottom bg-light fw-bold shadow-sm d-flex justify-content-between align-items-center flex-shrink-0">
                        <span className="fw-bold">Chat với {activeChat.name}</span>
                        <span className="small text-muted">{activeChat.email}</span>
                    </div>

                    {/* Body: Message Area (Scrollable) */}
                    <div className="flex-grow-1 p-4 overflow-auto d-flex flex-column gap-3 bg-white" style={{ height: '100%' }}>
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`d-flex ${msg.isAdminMsg ? 'justify-content-end' : 'justify-content-start'}`}>
                                <div className={`p-3 rounded-3 shadow-sm ${msg.isAdminMsg ? 'bg-primary text-white' : 'bg-light text-dark border'}`} style={{maxWidth: '70%'}}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Footer: Input (Fixed at bottom) */}
                    <div className="p-3 border-top bg-white flex-shrink-0">
                        <form onSubmit={handleReply} className="d-flex gap-2">
                            <input className="form-control" placeholder="Nhập tin nhắn trả lời..." value={text} onChange={e => setText(e.target.value)} />
                            <button className="btn btn-primary px-4"><FiSend/></button>
                        </form>
                    </div>
                </>
            ) : (
                <div className="d-flex align-items-center justify-content-center h-100 text-muted w-100">
                    <FiMessageSquare size={50} className="text-secondary opacity-25 me-3"/>
                    Chọn một hội thoại để bắt đầu hỗ trợ khách hàng
                </div>
            )}
        </div>
      </div>
    </div>
  );
}