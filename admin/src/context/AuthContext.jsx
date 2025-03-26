import { createContext, useContext, useState, useEffect } from 'react';
import { loginAdmin } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [adminInfo, setAdminInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedAdminInfo = localStorage.getItem('adminInfo');
    if (storedAdminInfo) {
      try {
        setAdminInfo(JSON.parse(storedAdminInfo));
      } catch (err) {
        localStorage.removeItem('adminInfo');
        localStorage.removeItem('adminToken');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    
    try {
      // Map username to email for the backend API
      const data = await loginAdmin({ email: username, password });
      
      if (data && data.token) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminInfo', JSON.stringify(data));
        setAdminInfo(data);
        return true;
      }
      
      return false;
    } catch (err) {
      setError(err.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminInfo');
    localStorage.removeItem('adminToken');
    setAdminInfo(null);
  };

  const isAdmin = !!adminInfo?.isAdmin;

  const contextValue = {
    adminInfo,
    isAdmin,
    loading,
    error,
    login,
    logout,
    setError
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
