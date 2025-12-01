import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { NotificationProvider } from "./context/NotificationContext";

// Components
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import ScrollToTop from "./components/common/ScrollToTop";
import ChatWidget from "./components/common/ChatWidget"; // <--- IMPORT CHAT WIDGET

// Pages
import Home from "./pages/public/Home";
import ProductList from "./pages/public/ProductList";
import ProductDetail from "./pages/public/ProductDetail";
import Unsubscribe from "./pages/public/Unsubscribe";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Cart from "./pages/user/Cart";
import Checkout from "./pages/user/Checkout";
import OrderSuccess from "./pages/user/OrderSuccess";
import Profile from "./pages/user/Profile";
import Wishlist from "./pages/user/Wishlist";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductForm from "./pages/admin/AdminProductForm";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminSubscribers from "./pages/admin/AdminSubscribers";
import AdminChat from "./pages/admin/AdminChat";

// Route Guards
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="vh-100 d-flex align-items-center justify-content-center"><div className="spinner-border text-primary"></div></div>;
  if (!user || (user.role !== "admin" && user.role !== "staff")) return <Navigate to="/" replace />;
  return children;
};

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="vh-100 d-flex align-items-center justify-content-center"><div className="spinner-border text-primary"></div></div>;
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <CartProvider>
          
          <ScrollToTop />

          <div className="d-flex flex-column min-vh-100">
            <Header />
            
            <main className="flex-fill">
              <Routes>
                {/* --- ROUTES --- */}
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/products/:slug" element={<ProductDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/unsubscribe" element={<Unsubscribe />} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
                <Route path="/admin/products/new" element={<AdminRoute><AdminProductForm /></AdminRoute>} />
                <Route path="/admin/products/:id" element={<AdminRoute><AdminProductForm /></AdminRoute>} />
                <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
                <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
                <Route path="/admin/reviews" element={<AdminRoute><AdminReviews /></AdminRoute>} />
                <Route path="/admin/subscribers" element={<AdminRoute><AdminSubscribers /></AdminRoute>} />
                <Route path="/admin/chat" element={<AdminRoute><AdminChat /></AdminRoute>} />
              </Routes>
            </main>

            <Footer />
            <ChatWidget /> 
          </div>

        </CartProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;