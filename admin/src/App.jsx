import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { SyncLoader } from 'react-spinners';

// Lazy load page components to reduce initial bundle size
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const UsersPage = lazy(() => import('./pages/UsersPage'));
const UserDetailPage = lazy(() => import('./pages/UserDetailPage'));
const UserOrdersPage = lazy(() => import('./pages/UserOrdersPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const OrderDetailPage = lazy(() => import('./pages/OrderDetailPage'));
const ErrorPage = lazy(() => import('./pages/ErrorPage'));

// Loading component to display while chunks are loading
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <SyncLoader color="#3B82F6" size={15} margin={2} />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route 
              path="/unauthorized" 
              element={<ErrorPage code={401} message="Unauthorized: You do not have permission to access this page" />} 
            />
            
            {/* Protected Routes (Admin Only) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/users/:userId" element={<UserDetailPage />} />
              <Route path="/users/:userId/orders" element={<UserOrdersPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/orders/:orderId" element={<OrderDetailPage />} />
            </Route>
            
            {/* Default Route */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* 404 Route */}
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
