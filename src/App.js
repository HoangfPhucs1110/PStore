import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { NotificationProvider } from "./context/NotificationContext";
import { WishlistProvider } from "./context/WishlistContext";
import { CompareProvider } from "./context/CompareContext"; // <--- 1. Import CompareProvider

import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import ScrollToTop from "./components/common/ScrollToTop";

import Home from "./pages/public/Home";
import ProductList from "./pages/public/ProductList";
import ProductDetail from "./pages/public/ProductDetail";
import Unsubscribe from "./pages/public/Unsubscribe";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Cart from "./pages/user/Cart";
import Checkout from "./pages/user/Checkout";
import OrderSuccess from "./pages/user/OrderSuccess";
import Profile from "./pages/user/Profile";
import Wishlist from "./pages/user/Wishlist";
import OrderLookup from "./pages/public/OrderLookup";
import PaymentResult from "./pages/user/PaymentResult";

// --- CÁC TRANG PUBLIC MỚI ---
import Policy from "./pages/public/Policy";
import Guide from "./pages/public/Guide";
import Contact from "./pages/public/Contact";
import FAQ from "./pages/public/FAQ";
import Compare from "./pages/public/Compare"; // <--- 2. Import Trang So Sánh

// --- ADMIN PAGES ---
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductForm from "./pages/admin/AdminProductForm";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminSubscribers from "./pages/admin/AdminSubscribers";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminCoupons from "./pages/admin/AdminCoupons";
import AdminContacts from "./pages/admin/AdminContacts";
import AdminChat from "./pages/admin/AdminChat"; // Chat Admin

// --- WIDGETS & BARS ---
import ChatWidget from "./components/common/ChatWidget"; // Chat Khách
import CompareBar from "./components/common/CompareBar"; // <--- 3. Import Thanh So Sánh

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="vh-100 d-flex align-items-center justify-content-center">Loading...</div>;
  if (!user || (user.role !== "admin" && user.role !== "staff")) return <Navigate to="/" replace />;
  return children;
};

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="vh-100 d-flex align-items-center justify-content-center">Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <WishlistProvider>
          {/* 4. Bọc CompareProvider để toàn bộ app dùng được tính năng so sánh */}
          <CompareProvider>
            <CartProvider>
              <ScrollToTop />
              <div className="d-flex flex-column min-vh-100">
                <Header />
                <main className="flex-fill">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/products/:slug" element={<ProductDetail />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                    
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} /> 
                    <Route path="/order-success" element={<OrderSuccess />} />
                    <Route path="/payment-result" element={<PaymentResult />} />
                    <Route path="/unsubscribe" element={<Unsubscribe />} />
                    
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
                    <Route path="/order-lookup" element={<OrderLookup/>} />

                    <Route path="/policy" element={<Policy />} />
                    <Route path="/guide" element={<Guide />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/faq" element={<FAQ />} />
                    
                    {/* 5. Route cho trang so sánh */}
                    <Route path="/compare" element={<Compare />} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                    <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
                    <Route path="/admin/coupons" element={<AdminRoute><AdminCoupons /></AdminRoute>} />
                    <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
                    <Route path="/admin/products/new" element={<AdminRoute><AdminProductForm /></AdminRoute>} />
                    <Route path="/admin/products/:id" element={<AdminRoute><AdminProductForm /></AdminRoute>} />
                    <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
                    <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
                    <Route path="/admin/reviews" element={<AdminRoute><AdminReviews /></AdminRoute>} />
                    <Route path="/admin/subscribers" element={<AdminRoute><AdminSubscribers /></AdminRoute>} />
                    <Route path="/admin/contacts" element={<AdminRoute><AdminContacts /></AdminRoute>} />
                    <Route path="/admin/chat" element={<AdminRoute><AdminChat /></AdminRoute>} />
                  </Routes>
                </main>
                <Footer />
                
                {/* Widgets hiển thị nổi (Floating) */}
                <ChatWidget />
                <CompareBar /> {/* 6. Hiển thị thanh so sánh ở dưới cùng */}
              </div>
            </CartProvider>
          </CompareProvider>
        </WishlistProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;