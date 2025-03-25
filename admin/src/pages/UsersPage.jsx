import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  RiSearchLine, 
  RiFilter2Line, 
  RiArrowRightSLine,
  RiAddLine,
  RiMoreLine,
  RiDeleteBinLine,
  RiEdit2Line,
  RiMailLine,
  RiCloseLine
} from 'react-icons/ri';
import api from '../api/apiClient';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showActionMenu, setShowActionMenu] = useState(null);

  const usersPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // Fetch real user data from the backend API
        const { data } = await api.get('/admin/users');
        
        setUsers(data);
        setFilteredUsers(data);
        setTotalPages(Math.ceil(data.length / usersPerPage));
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    let result = [...users];
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        user => 
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply status filter
    if (activeFilter !== 'all') {
      result = result.filter(user => {
        if (activeFilter === 'admin') return user.isAdmin;
        if (activeFilter === 'active') return user.status === 'active';
        if (activeFilter === 'inactive') return user.status === 'inactive';
        return true;
      });
    }
    
    setFilteredUsers(result);
    setTotalPages(Math.ceil(result.length / usersPerPage));
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, activeFilter, users]);

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
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

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const toggleAllSelection = () => {
    if (selectedUsers.length === getCurrentPageData().length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(getCurrentPageData().map(user => user._id));
    }
  };

  const toggleActionMenu = (userId) => {
    setShowActionMenu(prev => prev === userId ? null : userId);
  };

  const handleBulkAction = (action) => {
    if (action === 'delete') {
      console.log('Deleting users:', selectedUsers);
      // Implement delete logic
      alert(`${selectedUsers.length} users would be deleted`);
    }
    setSelectedUsers([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-text">Users</h1>
        
        <div className="flex space-x-2">
          {selectedUsers.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-text-secondary">
                {selectedUsers.length} selected
              </span>
              <button 
                className="bg-error text-white px-3 py-1.5 rounded-lg text-sm flex items-center hover:bg-red-600 transition-colors"
                onClick={() => handleBulkAction('delete')}
              >
                <RiDeleteBinLine className="mr-1" /> Delete
              </button>
              <button 
                className="text-text-secondary hover:text-text px-2 py-1.5 text-sm"
                onClick={() => setSelectedUsers([])}
              >
                <RiCloseLine className="w-5 h-5" />
              </button>
            </div>
          )}
          
          <button className="btn-apple px-4 py-2 text-sm flex items-center">
            <RiAddLine className="mr-2" /> Add User
          </button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder="Search users..."
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
            {activeFilter === 'all' ? 'All Users' : 
              activeFilter === 'admin' ? 'Admins' : 
              activeFilter === 'active' ? 'Active' : 'Inactive'}
          </button>
          
          {showFilters && (
            <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-apple z-10 border border-border">
              <button 
                className={`px-4 py-2 text-sm w-full text-left hover:bg-gray-50 ${activeFilter === 'all' ? 'text-accent' : 'text-text'}`}
                onClick={() => handleFilterChange('all')}
              >
                All Users
              </button>
              <button 
                className={`px-4 py-2 text-sm w-full text-left hover:bg-gray-50 ${activeFilter === 'admin' ? 'text-accent' : 'text-text'}`}
                onClick={() => handleFilterChange('admin')}
              >
                Admins
              </button>
              <button 
                className={`px-4 py-2 text-sm w-full text-left hover:bg-gray-50 ${activeFilter === 'active' ? 'text-accent' : 'text-text'}`}
                onClick={() => handleFilterChange('active')}
              >
                Active
              </button>
              <button 
                className={`px-4 py-2 text-sm w-full text-left hover:bg-gray-50 ${activeFilter === 'inactive' ? 'text-accent' : 'text-text'}`}
                onClick={() => handleFilterChange('inactive')}
              >
                Inactive
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
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
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
                        checked={selectedUsers.length > 0 && selectedUsers.length === getCurrentPageData().length}
                        onChange={toggleAllSelection}
                      />
                    </th>
                    <th>User</th>
                    <th>Status</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Last Login</th>
                    <th>Orders</th>
                    <th className="w-20"></th>
                  </tr>
                </thead>
                <tbody>
                  {getCurrentPageData().length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-10 text-text-secondary">
                        No users found matching your criteria
                      </td>
                    </tr>
                  ) : (
                    getCurrentPageData().map((user, index) => (
                      <tr key={user._id} className="stagger-item">
                        <td>
                          <input
                            type="checkbox"
                            className="rounded text-accent focus:ring-accent border-gray-300"
                            checked={selectedUsers.includes(user._id)}
                            onChange={() => toggleUserSelection(user._id)}
                          />
                        </td>
                        <td>
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-accent to-accent-hover flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                              {user.name.split(' ').map(name => name[0]).join('')}
                            </div>
                            <div className="ml-3">
                              <Link to={`/users/${user._id}`} className="font-medium text-text hover:text-accent">
                                {user.name}
                              </Link>
                              <div className="text-text-secondary text-xs flex items-center">
                                <RiMailLine className="mr-1" />
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`status-badge ${user.status === 'active' ? 'success' : 'error'}`}>
                            {user.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <span className={`text-sm ${user.isAdmin ? 'font-medium text-accent' : 'text-text-secondary'}`}>
                            {user.isAdmin ? 'Admin' : 'Customer'}
                          </span>
                        </td>
                        <td className="text-sm text-text-secondary">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="text-sm text-text-secondary">
                          {formatDate(user.lastLogin)}
                        </td>
                        <td className="text-sm font-medium text-text">
                          {user.ordersCount}
                        </td>
                        <td>
                          <div className="relative">
                            <button 
                              onClick={() => toggleActionMenu(user._id)}
                              className="p-2 text-text-secondary hover:text-text rounded-full hover:bg-gray-50 focus:outline-none"
                            >
                              <RiMoreLine className="w-5 h-5" />
                            </button>
                            
                            {showActionMenu === user._id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-apple z-10 border border-border">
                                <Link 
                                  to={`/users/${user._id}`} 
                                  className="block px-4 py-2 text-sm text-text hover:bg-gray-50 w-full text-left flex items-center"
                                >
                                  <RiArrowRightSLine className="mr-2" /> View Details
                                </Link>
                                <button 
                                  className="block px-4 py-2 text-sm text-text hover:bg-gray-50 w-full text-left flex items-center"
                                >
                                  <RiEdit2Line className="mr-2" /> Edit User
                                </button>
                                <button 
                                  className="block px-4 py-2 text-sm text-error hover:bg-gray-50 w-full text-left flex items-center"
                                >
                                  <RiDeleteBinLine className="mr-2" /> Delete User
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
                  Showing {(currentPage - 1) * usersPerPage + 1} to {Math.min(currentPage * usersPerPage, filteredUsers.length)} of {filteredUsers.length} users
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

export default UsersPage;
