import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <motion.header 
      className="bg-gray-900 text-white sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
    >
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/" className="text-xl font-bold flex items-center">
            <motion.span 
              className="text-blue-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Vision
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              X
            </motion.span>
          </Link>
        </motion.div>

        {/* Mobile menu button */}
        <button
          onClick={toggleMenu}
          className="md:hidden focus:outline-none"
          aria-label="Toggle menu"
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
              strokeWidth="2"
              d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            ></path>
          </svg>
        </button>

        {/* Desktop navigation */}
        <motion.div 
          className="hidden md:flex md:items-center md:space-x-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, staggerChildren: 0.1 }}
        >
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Link to="/" className="hover:text-blue-400 transition">
              Home
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Link to="/products" className="hover:text-blue-400 transition">
              Products
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Link to="/cart" className="hover:text-blue-400 transition relative">
              Cart
              <AnimatePresence>
                {getCartCount() > 0 && (
                  <motion.span 
                    className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    key="cart-count"
                  >
                    {getCartCount()}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </motion.div>
          {user ? (
            <motion.div className="relative" ref={dropdownRef}>
              <button 
                className="hover:text-blue-400 transition flex items-center"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {user.name.split(' ')[0]}
                <svg
                  className={`w-4 h-4 ml-1 transform ${isDropdownOpen ? 'rotate-180' : ''} transition-transform duration-200`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div 
                    className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-lg py-2 z-50"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  >
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 hover:bg-gray-100 transition"
                    >
                      Dashboard
                    </Link>
                    
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition text-red-600"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/login" 
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded transition"
              >
                Sign In
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* Mobile navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="md:hidden absolute top-[50px] left-0 right-0 w-full bg-gray-800 shadow-lg py-2 px-4 z-50 border-t border-gray-700"
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
            <Link
              to="/"
              className="block py-2 hover:text-blue-400 transition"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              to="/products"
              className="block py-2 hover:text-blue-400 transition"
              onClick={toggleMenu}
            >
              Products
            </Link>
            <Link
              to="/cart"
              className="block py-2 hover:text-blue-400 transition"
              onClick={toggleMenu}
            >
              Cart {getCartCount() > 0 && `(${getCartCount()})`}
            </Link>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="block py-2 hover:text-blue-400 transition"
                  onClick={toggleMenu}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    toggleMenu();
                  }}
                  className="block w-full text-left py-2 hover:text-blue-400 transition text-red-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block py-2 hover:text-blue-400 transition"
                onClick={toggleMenu}
              >
                Sign In
              </Link>
            )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};

export default Header;
