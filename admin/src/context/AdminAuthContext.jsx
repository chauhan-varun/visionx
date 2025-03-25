import { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import api from '../api/apiClient';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if admin is logged in on initial load
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        const adminInfoStr = localStorage.getItem('adminInfo');
        
        if (adminInfoStr) {
          const adminInfo = JSON.parse(adminInfoStr);
          
          // Set the admin data from localStorage
          setAdmin(adminInfo);
          setIsAuthenticated(true);
          
          // Validate token with backend - uncomment if you have a token validation endpoint
          /*
          try {
            await api.get('/api/admin/validate-token');
          } catch (err) {
            console.error('Token validation failed', err);
            logout();
            return;
          }
          */
        }
      } catch (err) {
        // Handle potential JSON parse error
        console.error('Error parsing admin info:', err);
        localStorage.removeItem('adminInfo'); // Remove invalid data
        setIsAuthenticated(false);
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);

  // Login admin
  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // Use backend authentication if enabled
      const useBackendAuth = import.meta.env.VITE_USE_BACKEND_AUTH === 'true';
      let adminData;
      
      if (useBackendAuth) {
        // Send authentication request to backend
        try {
          const { data } = await api.post('/api/auth/login', { email: username, password });
          
          // Check if user is admin
          if (!data.isAdmin) {
            throw new Error('Not authorized as admin');
          }
          
          adminData = data;
        } catch (err) {
          throw new Error(err.response?.data?.message || 'Authentication failed');
        }
      } else {
        // Client-side authentication using environment variables
        const adminUsername = import.meta.env.VITE_ADMIN_USERNAME?.trim();
        const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD?.trim();
        
        // Check if credentials match
        if (username === adminUsername && password === adminPassword) {
          // Create admin user object with token
          adminData = {
            _id: 'admin-1',
            name: 'Administrator',
            email: 'admin@example.com',
            isAdmin: true,
            token: 'admin-token-' + Math.random().toString(36).substring(2, 15)
          };
        } else {
          throw new Error('Invalid email or password');
        }
      }
      
      if (adminData) {
        // Set admin state and save to localStorage
        setAdmin(adminData);
        setIsAuthenticated(true);
        localStorage.setItem('adminInfo', JSON.stringify(adminData));
        
        // Show success toast with animation
        toast.success(`Welcome back, ${adminData.name || 'Administrator'}!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          transition: toast.TRANSITIONS.SLIDE,
        });
        
        return { success: true };
      }
    } catch (err) {
      const errorMessage = 
        err.message
          ? err.message
          : 'Login failed. Please check your credentials and try again.';
      setError(errorMessage);
      
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        transition: toast.TRANSITIONS.SLIDE,
      });
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Logout admin
  const logout = () => {
    const adminName = admin?.name || '';
    localStorage.removeItem('adminInfo');
    setAdmin(null);
    setIsAuthenticated(false);
    setError(null);
    
    toast.info(adminName ? `Goodbye, ${adminName}! You've been logged out.` : "You've been logged out.", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      transition: toast.TRANSITIONS.SLIDE,
    });
  };

  // Clear any errors
  const clearError = () => setError(null);
  
  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        loading,
        error,
        isAuthenticated,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

// Custom hook to use admin auth context
export const useAdminAuth = () => {
  return useContext(AdminAuthContext);
};
