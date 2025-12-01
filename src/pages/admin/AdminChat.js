import { useEffect, useState, useRef } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import io from "socket.io-client";
import { FiSend, FiUser, FiSearch, FiMessageSquare } from "react-icons/fi";
import { getImageUrl } from "../../utils/constants";

const socket = io("http://localhost:5000");

export default function AdminChat() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  
  // SỬA: Ref cho container chat
  const chatContainerRef = useRef(null);

  useEffect(() => {
    loadConversations();
    
    socket.on("receive_message", (data) => {
        if (activeChat && data.chatRoomId === activeChat._id) {
            setMessages(prev => [...prev, data]);
        } else {
            loadConversations();
        }
    });

    return () => socket.off("receive_message");
  }, [activeChat]);

  const loadConversations = () => {
    api.get("/chat/admin/conversations")
      .then(res => setConversations(res.data))
      .catch(console.error);
  };

  const selectChat = (convUser) => {
    if (!convUser || !convUser._id) return;
    setActiveChat(convUser);
    socket.emit("join_room", convUser._id);
    api.get(`/chat/${convUser._id}`).then(res => setMessages(res.data));
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !activeChat) return;

    const msgData = {
        chatRoomId: activeChat._id,
        sender: user,
        message: input,
        createdAt: new Date().toISOString()
    };

    socket.emit("send_message", msgData);

    try {
        await api.post("/chat", { message: input, chatRoomId: activeChat._id });
        setMessages(prev => [...prev, msgData]);
        setInput("");
    } catch (err) { console.error(err); }
  };

  // SỬA: Logic cuộn trang bằng scrollTo
  useEffect(() => {
    if (chatContainerRef.current) {
        const { scrollHeight, clientHeight } = chatContainerRef.current;
        chatContainerRef.current.scrollTo({
            top: scrollHeight - clientHeight,
            behavior: "smooth"
        });
    }
  }, [messages]);

  return (
    <div className="d-flex bg-light min-vh-100">
      <AdminSidebar />
      <div className="flex-grow-1 p-4 h-100 d-flex flex-column" style={{maxHeight: "100vh"}}>
        <h4 className="fw-bold mb-3">Hỗ trợ trực tuyến</h4>
        
        <div className="card border-0 shadow-sm flex-grow-1 overflow-hidden d-flex flex-row">
            
            {/* LIST KHÁCH HÀNG (Bên trái) */}
            <div className="border-end bg-white d-flex flex-column" style={{width: 320}}>
                <div className="p-3 border-bottom">
                    <div className="input-group">
                        <span className="input-group-text bg-light border-0"><FiSearch/></span>
                        <input className="form-control bg-light border-0" placeholder="Tìm kiếm..." />
                    </div>
                </div>
                <div className="overflow-auto flex-grow-1">
                    {conversations.filter(c => c._id).map(conv => (
                        <div 
                            key={conv._id._id} 
                            className={`p-3 border-bottom cursor-pointer hover-bg-light ${activeChat?._id === conv._id._id ? "bg-primary-subtle" : ""}`}
                            onClick={() => selectChat(conv._id)}
                        >
                            <div className="d-flex align-items-center gap-2">
                                <img 
                                    src={getImageUrl(conv._id.avatarUrl)} 
                                    className="rounded-circle border" width="40" height="40" style={{objectFit:"cover"}} 
                                    alt="" onError={(e)=>e.target.src="https://via.placeholder.com/40"}
                                />
                                <div className="overflow-hidden">
                                    <div className="fw-bold text-truncate">{conv._id.name || "Khách hàng"}</div>
                                    <div className="small text-muted text-truncate">{conv.lastMessage}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {conversations.filter(c => c._id).length === 0 && (
                        <div className="text-center p-3 text-muted small">Chưa có tin nhắn nào.</div>
                    )}
                </div>
            </div>

            {/* KHUNG CHAT (Bên phải) */}
            <div className="flex-grow-1 d-flex flex-column bg-light">
                {activeChat ? (
                    <>
                        <div className="p-3 bg-white border-bottom d-flex align-items-center gap-3">
                            <img 
                                src={getImageUrl(activeChat.avatarUrl)} 
                                className="rounded-circle border" width="40" height="40" style={{objectFit:"cover"}} 
                                alt="" onError={(e)=>e.target.src="https://via.placeholder.com/40"}
                            />
                            <div>
                                <div className="fw-bold">{activeChat.name}</div>
                                <div className="small text-muted">{activeChat.email}</div>
                            </div>
                        </div>

                        {/* SỬA: Gắn ref vào đây */}
                        <div 
                            ref={chatContainerRef}
                            className="flex-grow-1 p-4 overflow-auto"
                        >
                            {messages.map((msg, i) => {
                                const isMe = msg.sender?._id === user._id || msg.sender === user._id;
                                return (
                                    <div key={i} className={`d-flex mb-3 ${isMe ? "justify-content-end" : "justify-content-start"}`}>
                                        {!isMe && (
                                            <div className="me-2">
                                                <img src={getImageUrl(activeChat.avatarUrl)} className="rounded-circle" width="30" height="30" alt=""/>
                                            </div>
                                        )}
                                        <div className={`p-3 rounded-4 shadow-sm ${isMe ? "bg-primary text-white" : "bg-white text-dark"}`} style={{maxWidth: "70%"}}>
                                            {msg.message}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <form onSubmit={handleSend} className="p-3 bg-white border-top d-flex gap-2">
                            <input 
                                className="form-control border-0 bg-light rounded-pill px-3 py-2" 
                                placeholder="Nhập tin nhắn trả lời..."
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                autoFocus
                            />
                            <button className="btn btn-primary rounded-circle p-3 d-flex align-items-center justify-content-center">
                                <FiSend size={20}/>
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted">
                        <FiMessageSquare size={60} className="mb-3 opacity-25"/>
                        <h5>Chọn một cuộc hội thoại để bắt đầu</h5>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}