import { useState, useEffect, useRef } from "react";
import { FiMessageSquare, FiSend, FiMinus } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/api";
import io from "socket.io-client";

// Kết nối socket
const socket = io("http://localhost:5000");

export default function ChatWidget() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  
  // SỬA: Ref trỏ vào khung chứa tin nhắn (container) thay vì tin nhắn cuối
  const chatBodyRef = useRef(null);

  useEffect(() => {
    if (user) {
        socket.emit("join_room", user._id);

        api.get(`/chat/${user._id}`)
            .then(res => setMessages(res.data))
            .catch(() => {});

        socket.on("receive_message", (data) => {
            setMessages((prev) => [...prev, data]);
        });
    }
    return () => socket.off("receive_message");
  }, [user]);

  // SỬA: Logic cuộn trang an toàn, chỉ cuộn nội dung bên trong box
  useEffect(() => {
    if (chatBodyRef.current) {
        const { scrollHeight, clientHeight } = chatBodyRef.current;
        chatBodyRef.current.scrollTo({
            top: scrollHeight - clientHeight,
            behavior: "smooth"
        });
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !user) return;

    const msgData = {
        chatRoomId: user._id,
        sender: { _id: user._id, role: 'user', avatarUrl: user.avatarUrl }, 
        message: input,
        createdAt: new Date().toISOString()
    };

    socket.emit("send_message", msgData);

    try {
        await api.post("/chat", { 
            message: input, 
            chatRoomId: user._id 
        });
        
        setMessages((prev) => [...prev, msgData]);
        setInput("");
    } catch (err) {
        console.error("Lỗi gửi tin:", err);
    }
  };

  if (!user) return null; 

  return (
    <div className="position-fixed bottom-0 end-0 m-4" style={{ zIndex: 9999 }}>
      {!isOpen ? (
        <button 
            className="btn btn-primary rounded-circle shadow-lg d-flex align-items-center justify-content-center p-0 animate-bounce"
            style={{ width: 60, height: 60 }}
            onClick={() => setIsOpen(true)}
        >
            <FiMessageSquare size={28} />
        </button>
      ) : (
        <div className="card border-0 shadow-lg" style={{ width: 350, height: 450, borderRadius: "15px 15px 5px 5px" }}>
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center py-3" style={{borderRadius: "15px 15px 0 0"}}>
                <div className="d-flex align-items-center gap-2">
                    <div className="bg-white text-primary rounded-circle p-1 d-flex"><FiMessageSquare/></div>
                    <span className="fw-bold">Hỗ trợ PStore</span>
                </div>
                <div>
                    <button className="btn btn-sm btn-link text-white p-0 me-2" onClick={() => setIsOpen(false)}><FiMinus size={20}/></button>
                </div>
            </div>
            
            {/* SỬA: Gắn ref vào đây */}
            <div 
                ref={chatBodyRef}
                className="card-body bg-light overflow-auto p-3" 
                style={{ height: 340 }}
            >
                {messages.length === 0 && <div className="text-center text-muted small mt-5">Xin chào! Chúng tôi có thể giúp gì cho bạn?</div>}
                {messages.map((msg, idx) => {
                    const isMe = msg.sender?._id === user._id || msg.sender === user._id;
                    return (
                        <div key={idx} className={`d-flex mb-2 ${isMe ? "justify-content-end" : "justify-content-start"}`}>
                            <div 
                                className={`p-2 px-3 rounded-3 small ${isMe ? "bg-primary text-white" : "bg-white border text-dark"}`}
                                style={{maxWidth: "80%", wordBreak: "break-word"}}
                            >
                                {msg.message}
                            </div>
                        </div>
                    );
                })}
            </div>

            <form onSubmit={handleSend} className="card-footer bg-white p-2 d-flex gap-2 border-top-0">
                <input 
                    className="form-control border-0 bg-light rounded-pill px-3" 
                    placeholder="Nhập tin nhắn..." 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center p-0" style={{width: 40, height: 40}}>
                    <FiSend size={18} className="ms-1"/>
                </button>
            </form>
        </div>
      )}
      
      <style>{`
        .animate-bounce { animation: bounce 2s infinite; }
        @keyframes bounce { 0%, 20%, 50%, 80%, 100% {transform: translateY(0);} 40% {transform: translateY(-10px);} 60% {transform: translateY(-5px);} }
      `}</style>
    </div>
  );
}