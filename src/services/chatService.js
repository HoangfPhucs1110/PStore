import api from "../api/api";

export const chatService = {
    // Lấy lịch sử tin nhắn giữa 2 user
    getHistory: async (userId1, userId2) => {
        // Giả định backend có endpoint để lấy lịch sử
        // GET /api/messages?user1=...&user2=...
        // Hiện tại ta chỉ mock data
        return [
            // Dữ liệu mock (tạm thời)
            { senderId: userId1, receiverId: userId2, text: "Xin chào! Tôi có thể giúp gì cho bạn?", isAdminMsg: true, timestamp: Date.now() },
        ];
    },
    
    // Lấy danh sách tất cả người dùng đã chat gần đây (cho admin sidebar)
    getRecentConversations: async () => {
        // API này cần được xây dựng ở backend để truy vấn Message model
        // GET /api/messages/recent
        // Hiện tại ta chỉ mock dữ liệu
        return [
            { senderId: 'user_1234', name: 'Khách hàng 1234', email: 'kh1234@email.com', lastMsg: 'Sản phẩm đó có sẵn không?' },
        ];
    }
};