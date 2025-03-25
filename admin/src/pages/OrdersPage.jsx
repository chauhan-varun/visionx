import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  RiSearchLine, 
  RiFilter2Line, 
  RiArrowRightSLine,
  RiMoreLine,
  RiDeleteBinLine,
  RiFileDownloadLine,
  RiMailLine,
  RiCloseLine
} from 'react-icons/ri';
import api from '../api/apiClient';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showActionMenu, setShowActionMenu] = useState(null);

  const ordersPerPage = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        
        // Fetch real order data from the backend API
        const { data } = await api.get('/admin/orders');
        
        setOrders(data);
        setFilteredOrders(data);
        setTotalPages(Math.ceil(data.length / ordersPerPage));
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    let result = [...orders];
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        order => 
          order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply status filter
    if (activeFilter !== 'all') {
      result = result.filter(order => {
        if (activeFilter === 'pending') return order.status === 'Pending Payment';
        if (activeFilter === 'processing') return order.status === 'Processing';
        if (activeFilter === 'shipped') return order.status === 'Shipped';
        if (activeFilter === 'delivered') return order.status === 'Delivered';
        return true;
      });
    }
    
    setFilteredOrders(result);
    setTotalPages(Math.ceil(result.length / ordersPerPage));
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, activeFilter, orders]);

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * ordersPerPage;
    const endIndex = startIndex + ordersPerPage;
    return filteredOrders.slice(startIndex, endIndex);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setShowFilters(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const toggleOrderSelection = (orderId) => {
    setSelectedOrders(prev => {
      if (prev.includes(orderId)) {
        return prev.filter(id => id !== orderId);
      } else {
        return [...prev, orderId];
      }
    });
  };

  const toggleAllSelection = () => {
    if (selectedOrders.length === getCurrentPageData().length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(getCurrentPageData().map(order => order._id));
    }
  };

  const toggleActionMenu = (orderId) => {
    setShowActionMenu(prev => prev === orderId ? null : orderId);
  };

  const handleBulkAction = (action) => {
    if (action === 'export') {
      console.log('Exporting orders:', selectedOrders);
      alert(`${selectedOrders.length} orders would be exported`);
    }
    setSelectedOrders([]);
  };

  const getStatusColorClass = (status) => {
    switch (status) {
      case 'Delivered':
        return 'success';
      case 'Shipped':
        return 'info';
      case 'Processing':
        return 'pending';
      case 'Pending Payment':
        return 'error';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-text">Orders</h1>
        
        <div className="flex space-x-2">
          {selectedOrders.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-text-secondary">
                {selectedOrders.length} selected
              </span>
              <button 
                className="bg-accent text-white px-3 py-1.5 rounded-lg text-sm flex items-center hover:bg-accent-hover transition-colors"
                onClick={() => handleBulkAction('export')}
              >
                <RiFileDownloadLine className="mr-1" /> Export
              </button>
              <button 
                className="text-text-secondary hover:text-text px-2 py-1.5 text-sm"
                onClick={() => setSelectedOrders([])}
              >
                <RiCloseLine className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2 border border-border rounded-lg w-full focus:ring-1 focus:ring-accent focus:border-accent text-sm"
          />
        </div>
        
        <div className="relative">
          <button 
            onClick={toggleFilters}
            className="px-4 py-2 border border-border rounded-lg flex items-center text-sm hover:border-text-secondary transition-colors"
          >
            <RiFilter2Line className="mr-2" />
            {activeFilter === 'all' ? 'All Orders' : 
              activeFilter === 'pending' ? 'Pending Payment' : 
              activeFilter === 'processing' ? 'Processing' : 
              activeFilter === 'shipped' ? 'Shipped' : 'Delivered'}
          </button>
          
          {showFilters && (
            <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-apple z-10 border border-border">
              <button 
                className={`px-4 py-2 text-sm w-full text-left hover:bg-gray-50 ${activeFilter === 'all' ? 'text-accent' : 'text-text'}`}
                onClick={() => handleFilterChange('all')}
              >
                All Orders
              </button>
              <button 
                className={`px-4 py-2 text-sm w-full text-left hover:bg-gray-50 ${activeFilter === 'pending' ? 'text-accent' : 'text-text'}`}
                onClick={() => handleFilterChange('pending')}
              >
                Pending Payment
              </button>
              <button 
                className={`px-4 py-2 text-sm w-full text-left hover:bg-gray-50 ${activeFilter === 'processing' ? 'text-accent' : 'text-text'}`}
                onClick={() => handleFilterChange('processing')}
              >
                Processing
              </button>
              <button 
                className={`px-4 py-2 text-sm w-full text-left hover:bg-gray-50 ${activeFilter === 'shipped' ? 'text-accent' : 'text-text'}`}
                onClick={() => handleFilterChange('shipped')}
              >
                Shipped
              </button>
              <button 
                className={`px-4 py-2 text-sm w-full text-left hover:bg-gray-50 ${activeFilter === 'delivered' ? 'text-accent' : 'text-text'}`}
                onClick={() => handleFilterChange('delivered')}
              >
                Delivered
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center space-x-4 py-3">
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="apple-table">
                <thead>
                  <tr>
                    <th className="w-10">
                      <input
                        type="checkbox"
                        className="rounded text-accent focus:ring-accent border-gray-300"
                        checked={selectedOrders.length > 0 && selectedOrders.length === getCurrentPageData().length}
                        onChange={toggleAllSelection}
                      />
                    </th>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Total</th>
                    <th className="w-20"></th>
                  </tr>
                </thead>
                <tbody>
                  {getCurrentPageData().length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-10 text-text-secondary">
                        No orders found matching your criteria
                      </td>
                    </tr>
                  ) : (
                    getCurrentPageData().map((order, index) => (
                      <tr key={order._id} className="stagger-item">
                        <td>
                          <input
                            type="checkbox"
                            className="rounded text-accent focus:ring-accent border-gray-300"
                            checked={selectedOrders.includes(order._id)}
                            onChange={() => toggleOrderSelection(order._id)}
                          />
                        </td>
                        <td>
                          <Link to={`/orders/${order._id}`} className="font-medium text-text hover:text-accent">
                            #{order._id}
                          </Link>
                        </td>
                        <td>
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent to-accent-hover flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                              {order.user.name.split(' ').map(name => name[0]).join('')}
                            </div>
                            <div className="ml-3">
                              <div className="font-medium text-text">{order.user.name}</div>
                              <div className="text-text-secondary text-xs flex items-center">
                                <RiMailLine className="mr-1" />
                                {order.user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="text-sm text-text-secondary">
                          {formatDate(order.createdAt)}
                        </td>
                        <td>
                          <span className={`status-badge ${getStatusColorClass(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="text-sm">
                          <div className="font-medium text-text">{order.paymentMethod}</div>
                          <div className="text-text-secondary text-xs">
                            {order.isPaid ? `Paid on ${formatDate(order.paidAt)}` : 'Not paid'}
                          </div>
                        </td>
                        <td className="text-sm font-medium text-text">
                          {formatCurrency(order.totalPrice)}
                        </td>
                        <td>
                          <div className="relative">
                            <button 
                              onClick={() => toggleActionMenu(order._id)}
                              className="p-2 text-text-secondary hover:text-text rounded-full hover:bg-gray-50 focus:outline-none"
                            >
                              <RiMoreLine className="w-5 h-5" />
                            </button>
                            
                            {showActionMenu === order._id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-apple z-10 border border-border">
                                <Link 
                                  to={`/orders/${order._id}`} 
                                  className="block px-4 py-2 text-sm text-text hover:bg-gray-50 w-full text-left flex items-center"
                                >
                                  <RiArrowRightSLine className="mr-2" /> View Details
                                </Link>
                                <button 
                                  className="block px-4 py-2 text-sm text-text hover:bg-gray-50 w-full text-left flex items-center"
                                >
                                  <RiFileDownloadLine className="mr-2" /> Download Invoice
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-border">
                <div className="text-sm text-text-secondary">
                  Showing {(currentPage - 1) * ordersPerPage + 1} to {Math.min(currentPage * ordersPerPage, filteredOrders.length)} of {filteredOrders.length} orders
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md text-sm ${
                      currentPage === 1 
                        ? 'text-text-secondary cursor-not-allowed' 
                        : 'text-text hover:bg-gray-100'
                    }`}
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum = i + 1;
                    
                    // For many pages, show pagination like: 1 ... 4 5 6 ... 20
                    if (totalPages > 5) {
                      if (currentPage <= 3) {
                        pageNum = i + 1;
                        if (i === 4) pageNum = totalPages;
                        if (i === 3 && totalPages > 5) pageNum = '...';
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                        if (i === 0) pageNum = 1;
                        if (i === 1 && totalPages > 5) pageNum = '...';
                      } else {
                        if (i === 0) pageNum = 1;
                        else if (i === 1) pageNum = '...';
                        else if (i === 3) pageNum = '...';
                        else if (i === 4) pageNum = totalPages;
                        else pageNum = currentPage;
                      }
                    }
                    
                    return (
                      <button
                        key={i}
                        onClick={() => typeof pageNum === 'number' && handlePageChange(pageNum)}
                        disabled={pageNum === '...'}
                        className={`px-3 py-1 rounded-md text-sm ${
                          pageNum === currentPage
                            ? 'bg-accent text-white'
                            : pageNum === '...'
                              ? 'text-text-secondary cursor-default'
                              : 'text-text hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md text-sm ${
                      currentPage === totalPages
                        ? 'text-text-secondary cursor-not-allowed'
                        : 'text-text hover:bg-gray-100'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
