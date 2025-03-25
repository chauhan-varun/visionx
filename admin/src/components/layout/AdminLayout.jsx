import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { 
  RiDashboardLine, 
  RiUser3Line, 
  RiShoppingCartLine, 
  RiLogoutBoxLine,
  RiMenuLine,
  RiCloseLine,
  RiNotification3Line,
  RiSearchLine,
  RiArrowLeftSLine,
  RiSettings3Line
} from 'react-icons/ri';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const { admin, logout } = useAdminAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageLoaded, setPageLoaded] = useState(false);

  // Set active path once on initial load
  useEffect(() => {
    setPageLoaded(true);
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const menuItems = [
    { path: '/', icon: <RiDashboardLine className="w-5 h-5" />, label: 'Dashboard' },
    { path: '/users', icon: <RiUser3Line className="w-5 h-5" />, label: 'Users' },
    { path: '/orders', icon: <RiShoppingCartLine className="w-5 h-5" />, label: 'Orders' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => document.getElementById('search-input')?.focus(), 100);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Implement search functionality here
    console.log('Searching for:', searchQuery);
  };

  const handleLogout = () => {
    logout();
  };

  if (!pageLoaded) return null;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100">
        <div className="flex items-center justify-center h-16 border-b border-gray-100 px-6">
          <h1 className="text-xl font-semibold text-text">VisionX Admin</h1>
        </div>
        <nav className="flex-1 pt-4 pb-4 overflow-y-auto">
          <ul className="px-2 space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm rounded-lg transition-all duration-200 ${
                    location.pathname === item.path
                      ? 'bg-gray-100 text-accent sidebar-item active'
                      : 'text-text-secondary hover:bg-gray-50 hover:text-text'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t border-gray-100 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-text-secondary rounded-lg hover:bg-gray-50 hover:text-text transition-all duration-200"
          >
            <RiLogoutBoxLine className="w-5 h-5" />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30" onClick={toggleMobileMenu}></div>
      )}

      {/* Sidebar - Mobile */}
      <aside
        className={`fixed inset-y-0 left-0 md:hidden flex flex-col w-64 bg-white z-40 transform ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between h-16 border-b border-gray-100 px-6">
          <h1 className="text-xl font-semibold text-text">VisionX Admin</h1>
          <button onClick={toggleMobileMenu} className="text-text-secondary hover:text-text">
            <RiCloseLine className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex-1 pt-4 pb-4 overflow-y-auto">
          <ul className="px-2 space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm rounded-lg transition-all duration-200 ${
                    location.pathname === item.path
                      ? 'bg-gray-100 text-accent sidebar-item active'
                      : 'text-text-secondary hover:bg-gray-50 hover:text-text'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t border-gray-100 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-text-secondary rounded-lg hover:bg-gray-50 hover:text-text transition-all duration-200"
          >
            <RiLogoutBoxLine className="w-5 h-5" />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content container */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top header */}
        <header className="flex items-center justify-between h-16 bg-white border-b border-gray-100 px-4 md:px-6">
          <div className="flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="mr-4 text-text-secondary md:hidden focus:outline-none"
            >
              <RiMenuLine className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-semibold text-text hidden md:block">
              {menuItems.find((item) => item.path === location.pathname)?.label || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center space-x-3">
            {/* Search button */}
            <button
              onClick={toggleSearch}
              className="p-2 text-text-secondary hover:text-text rounded-full hover:bg-gray-100 transition-colors"
            >
              <RiSearchLine className="w-5 h-5" />
            </button>
            
            {/* Notifications */}
            <div className="relative">
              <button className="p-2 text-text-secondary hover:text-text rounded-full hover:bg-gray-100 transition-colors">
                <RiNotification3Line className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
              </button>
            </div>
            
            {/* Admin profile */}
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent to-accent-hover flex items-center justify-center text-white font-semibold text-sm">
                {admin?.name ? admin.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="ml-2 hidden md:block">
                <p className="text-sm font-medium text-text">{admin?.name || 'Admin'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Search overlay */}
        {isSearchOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center pt-20 animate-fade-in">
            <div className="w-full max-w-2xl p-4 animate-slide-up">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="flex items-center p-4 border-b border-gray-100">
                  <RiSearchLine className="text-text-secondary mr-3" />
                  <form onSubmit={handleSearchSubmit} className="flex-1">
                    <input
                      id="search-input"
                      type="text"
                      placeholder="Search for users, orders, or products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full focus:outline-none"
                    />
                  </form>
                  <button
                    onClick={toggleSearch}
                    className="ml-2 text-text-secondary hover:text-text"
                  >
                    <RiCloseLine className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-text-secondary text-sm">
                    Start typing to search for users, orders, or products
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
