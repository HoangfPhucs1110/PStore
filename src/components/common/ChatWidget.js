import { useEffect, useState, useRef } from "react";
import { FiMessageSquare, FiX, FiSend } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import io from "socket.io-client";

// URL Backend
const ENDPOINT = "http://localhost:5000";

export default function ChatWidget() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const socketRef = useRef();

  useEffect(() => {
    if (!user) return; // Chỉ hiện chat khi đăng nhập (hoặc mở rộng cho guest sau)

    // Kết nối Socket
    socketRef.current = io(ENDPOINT);
    
    // Join room riêng của user
    socketRef.current.emit("join_room", user._id);

    // Lắng nghe tin nhắn đến
    socketRef.current.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [user]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim() || !user) return;

    const msgData = {
      senderId: user._id,
      receiverId: "admin_room", // Quy ước: gửi vào room admin hoặc để admin bắt sự kiện
      text: text,
      isAdminMsg: false,
      timestamp: new Date().toISOString()
    };

    // Gửi lên server
    socketRef.current.emit("send_message", msgData);
    
    // Hiện ngay ở phía mình
    setMessages((prev) => [...prev, msgData]);
    setText("");
  };

  if (!user) return null;

  return (
    <div className="position-fixed bottom-0 end-0 m-4" style={{ zIndex: 9999 }}>
      {!isOpen ? (
        <button 
            className="btn btn-primary rounded-circle shadow-lg d-flex align-items-center justify-content-center p-0"
            style={{ width: 60, height: 60 }}
            onClick={() => setIsOpen(true)}
        >
            <FiMessageSquare size={28} />
        </button>
      ) : (
        <div className="card shadow-lg border-0 overflow-hidden animate-fade-up" style={{ width: 320, height: 450 }}>
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <div className="fw-bold">Hỗ trợ trực tuyến</div>
                <button className="btn btn-sm text-white" onClick={() => setIsOpen(false)}><FiX size={20}/></button>
            </div>
            
            <div className="card-body bg-light overflow-auto d-flex flex-column gap-2 p-3" style={{ height: 340 }}>
                {messages.length === 0 && <p className="text-muted small text-center mt-4">Xin chào {user.name}, chúng tôi có thể giúp gì cho bạn?</p>}
                {messages.map((msg, idx) => (
                    <div key={idx} className={`d-flex ${msg.isAdminMsg ? 'justify-content-start' : 'justify-content-end'}`}>
                        <div className={`rounded-3 p-2 px-3 small ${msg.isAdminMsg ? 'bg-white border' : 'bg-primary text-white'}`} style={{maxWidth: '80%'}}>
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>

            <div className="card-footer bg-white p-2">
                <form onSubmit={handleSend} className="d-flex gap-2">
                    <input 
                        className="form-control form-control-sm" 
                        placeholder="Nhập tin nhắn..." 
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <button className="btn btn-primary btn-sm"><FiSend /></button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}