import { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in on initial load
    try {
      const userInfoStr = localStorage.getItem('userInfo');
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr);
        setUser(userInfo);
        setIsAuthenticated(true);
      }
    } catch (err) {
      // Handle potential JSON parse error
      localStorage.removeItem('userInfo'); // Remove invalid data
    } finally {
      setLoading(false);
    }
  }, []);

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.post('/auth/login', { email, password });
      setUser(data);
      setIsAuthenticated(true);
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success(`Welcome back, ${data.name?.split(' ')[0] || 'User'}!`);
      return data;
    } catch (err) {
      const errorMessage = 
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Login failed. Please check your credentials and try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Register user
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.post('/auth/register', {
        name,
        email,
        password,
      });
      setUser(data);
      setIsAuthenticated(true);
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success(`Welcome to VisionX, ${name?.split(' ')[0] || 'User'}! Your account has been created.`);
      return data;
    } catch (err) {
      let errorMessage = 'Registration failed. Please try again.';
      
      if (err.response) {
        if (err.response.status === 400 && err.response.data.message) {
          // Handle specific validation errors
          errorMessage = err.response.data.message;
        } else if (err.response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    const userName = user?.name?.split(' ')[0] || '';
    localStorage.removeItem('userInfo');
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
    toast.info(userName ? `Goodbye, ${userName}! You've been logged out.` : "You've been logged out.");
  };

  // Update profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.put('/auth/profile', userData);
      setUser(data);
      setIsAuthenticated(true);
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('Your profile has been updated successfully!');
      return data;
    } catch (err) {
      const errorMessage = err.response && err.response.data.message
        ? err.response.data.message
        : 'Profile update failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Clear any errors
  const clearError = () => setError(null);
  
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
