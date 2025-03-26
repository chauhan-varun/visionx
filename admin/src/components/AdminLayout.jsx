import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const AdminLayout = ({ children }) => {
  const { adminInfo, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'bg-blue-700' : '';
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Animation variants
  const navbarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: {
        duration: 0.3,
        when: "beforeChildren"
      }
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const navItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.2
      }
    })
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <motion.header 
        initial="hidden"
        animate="visible"
        variants={navbarVariants}
        className="bg-blue-600 text-white shadow-md sticky top-0 z-10"
      >
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex justify-between items-center h-10 md:h-12">
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link to="/dashboard" className="text-xl md:text-2xl font-bold">
                VisionX Admin
              </Link>
            </motion.div>
            
            {/* Mobile menu button */}
            <motion.button 
              whileTap={{ scale: 0.95 }}
              className="md:hidden p-2 rounded-md hover:bg-blue-700 focus:outline-none"
              onClick={toggleMobileMenu}
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                />
              </svg>
            </motion.button>
            
            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-6">
              {adminInfo && (
                <>
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-base font-medium"
                  >
                    {adminInfo.name}
                  </motion.span>
                  <motion.button 
                    whileHover={{ scale: 1.05, backgroundColor: "#1E40AF" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-md bg-blue-700 text-sm font-medium transition duration-200"
                  >
                    Logout
                  </motion.button>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.header>
      
      {/* Mobile menu dropdown with animation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="md:hidden bg-blue-600 text-white overflow-hidden"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <nav className="px-4 py-2 space-y-1">
              <motion.div custom={0} variants={navItemVariants}>
                <Link 
                  to="/dashboard" 
                  className={`block px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive('/dashboard')}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </motion.div>
              <motion.div custom={1} variants={navItemVariants}>
                <Link 
                  to="/users" 
                  className={`block px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive('/users')}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Users
                </Link>
              </motion.div>
              <motion.div custom={2} variants={navItemVariants}>
                <Link 
                  to="/orders" 
                  className={`block px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive('/orders')}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Orders
                </Link>
              </motion.div>
              {adminInfo && (
                <motion.div custom={3} variants={navItemVariants}>
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main content */}
      <div className="flex flex-1">
        {/* Sidebar navigation for desktop */}
        <motion.aside 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden md:block w-64 bg-gray-800 text-white p-4 sticky top-[4.5rem] h-[calc(100vh-4.5rem)] overflow-y-auto"
        >
          <nav className="space-y-2">
            <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
              <Link 
                to="/dashboard" 
                className={`block px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 ${isActive('/dashboard')}`}
              >
                Dashboard
              </Link>
            </motion.div>
            <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
              <Link 
                to="/users" 
                className={`block px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 ${isActive('/users')}`}
              >
                Users
              </Link>
            </motion.div>
            <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
              <Link 
                to="/orders" 
                className={`block px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 ${isActive('/orders')}`}
              >
                Orders
              </Link>
            </motion.div>
          </nav>
        </motion.aside>
        
        {/* Page content */}
        <motion.main 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 p-4 md:p-6 overflow-x-hidden"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};

export default AdminLayout;
