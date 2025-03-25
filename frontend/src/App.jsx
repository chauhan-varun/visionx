import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastContainer } from 'react-toastify';
import { AnimatePresence } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import Layout from './components/layout/Layout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import DashboardPage from './pages/DashboardPage';

// Animation components
import AnimatedPage from './components/animations/AnimatedPage';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const userInfo = localStorage.getItem('userInfo');
  
  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// AnimatedRoutes component for handling transitions
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <Layout>
            <AnimatedPage><HomePage /></AnimatedPage>
          </Layout>
        } />
        <Route path="/login" element={
          <Layout>
            <AnimatedPage><LoginPage /></AnimatedPage>
          </Layout>
        } />
        <Route path="/register" element={
          <Layout>
            <AnimatedPage><RegisterPage /></AnimatedPage>
          </Layout>
        } />
        <Route path="/products" element={
          <Layout>
            <AnimatedPage><ProductsPage /></AnimatedPage>
          </Layout>
        } />
        <Route path="/products/:id" element={
          <Layout>
            <AnimatedPage><ProductDetailPage /></AnimatedPage>
          </Layout>
        } />
        <Route path="/cart" element={
          <Layout>
            <AnimatedPage><CartPage /></AnimatedPage>
          </Layout>
        } />
        <Route 
          path="/checkout" 
          element={
            <ProtectedRoute>
              <Layout>
                <AnimatedPage><CheckoutPage /></AnimatedPage>
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/order-success/:id" 
          element={
            <ProtectedRoute>
              <Layout>
                <AnimatedPage><OrderSuccessPage /></AnimatedPage>
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Layout>
                <AnimatedPage><DashboardPage /></AnimatedPage>
              </Layout>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <AnimatedRoutes />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
