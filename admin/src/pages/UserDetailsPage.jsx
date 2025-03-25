import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  RiArrowLeftLine,
  RiUser3Line,
  RiEdit2Line,
  RiMailLine,
  RiPhoneLine,
  RiMapPinLine,
  RiCalendarLine,
  RiShoppingBag3Line,
  RiShoppingCartLine,
  RiLockLine,
  RiCheckLine,
  RiCloseLine,
  RiAlertLine
} from 'react-icons/ri';
import api from '../api/apiClient';

const UserDetailsPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userOrders, setUserOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);

        // Fetch actual data from API
        const { data } = await api.get(`/admin/users/${id}`);
        setUser(data);
        
        // Also fetch the user's orders
        try {
          const { data: ordersData } = await api.get(`/admin/users/${id}/orders`);
          setUserOrders(ordersData || []);
        } catch (orderError) {
          console.error('Error fetching user orders:', orderError);
          setUserOrders([]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user details:', error);
        toast.error('Failed to load user details');
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  const handleUpdateUserStatus = async (newStatus) => {
    try {
      setUpdating(true);
      const response = await api.put(`/admin/users/${id}/status`, { status: newStatus });
      const updatedUser = response.data;
      
      setUser(prevUser => ({
        ...prevUser,
        status: updatedUser.status
      }));

      toast.success(`User status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateAdminStatus = async (isAdmin) => {
    try {
      setUpdating(true);
      const response = await api.put(`/admin/users/${id}/role`, { isAdmin });
      const updatedUser = response.data;
      
      setUser(prevUser => ({
        ...prevUser,
        isAdmin: updatedUser.isAdmin
      }));

      toast.success(`User ${isAdmin ? 'promoted to admin' : 'demoted from admin'}`);
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link to="/users" className="p-2 rounded-full hover:bg-gray-100">
            <RiArrowLeftLine className="w-5 h-5 text-text-secondary" />
          </Link>
          <div className="h-8 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="h-8 bg-gray-200 rounded w-full mt-4"></div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-text">User not found</h2>
        <p className="text-text-secondary mt-2">The user you're looking for doesn't exist or has been removed.</p>
        <Link to="/users" className="mt-6 inline-block btn-apple">
          Return to Users
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-4">
        <Link
          to="/users"
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          title="Back to Users"
        >
          <RiArrowLeftLine className="w-5 h-5 text-text-secondary" />
        </Link>
        <h1 className="text-2xl font-semibold text-text">User Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar with user summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col items-center text-center">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover mb-4"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-accent to-accent-hover flex items-center justify-center text-white font-semibold text-2xl mb-4">
                  {user.name.split(' ').map(name => name[0]).join('')}
                </div>
              )}
              <h2 className="text-xl font-semibold text-text">{user.name}</h2>
              <p className="text-text-secondary mb-1">{user.email}</p>
              <div className="mt-2">
                <span className={`status-badge ${user.status === 'active' ? 'success' : 'error'}`}>
                  {user.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="mt-4 w-full">
                <Link to={`/users/${user._id}/edit`} className="btn-secondary w-full flex items-center justify-center">
                  <RiEdit2Line className="mr-2" /> Edit Profile
                </Link>
              </div>
              
              <div className="mt-6 w-full">
                <div className="text-left border-t border-gray-100 pt-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-text-secondary">User ID</span>
                    <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{user._id}</span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-text-secondary">Joined</span>
                    <span className="text-text-secondary text-sm">{formatDate(user.createdAt).split(',')[0]}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">Last Login</span>
                    <span className="text-text-secondary text-sm">{formatDate(user.lastLogin).split(',')[0]}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Tabs */}
            <div className="border-b border-gray-100">
              <div className="flex space-x-2 px-4">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'profile'
                      ? 'border-accent text-accent'
                      : 'border-transparent text-text-secondary hover:text-text hover:border-gray-300'
                  }`}
                >
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'orders'
                      ? 'border-accent text-accent'
                      : 'border-transparent text-text-secondary hover:text-text hover:border-gray-300'
                  }`}
                >
                  Orders
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'settings'
                      ? 'border-accent text-accent'
                      : 'border-transparent text-text-secondary hover:text-text hover:border-gray-300'
                  }`}
                >
                  Settings
                </button>
              </div>
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-text mb-6">User Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-text-secondary text-sm">Full Name</p>
                    <p className="text-text font-medium flex items-center">
                      <RiUser3Line className="mr-2 text-text-secondary" /> {user.name}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-text-secondary text-sm">Email</p>
                    <p className="text-text font-medium flex items-center">
                      <RiMailLine className="mr-2 text-text-secondary" /> {user.email}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-text-secondary text-sm">Phone</p>
                    <p className="text-text font-medium flex items-center">
                      <RiPhoneLine className="mr-2 text-text-secondary" /> {user.phone || 'Not provided'}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-text-secondary text-sm">Account Status</p>
                    <p className="text-text font-medium">
                      <span className={`status-badge ${user.status === 'active' ? 'success' : 'error'}`}>
                        {user.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-text-secondary text-sm">Account Type</p>
                    <p className="text-text font-medium">
                      <span className={`${user.isAdmin ? 'text-accent font-semibold' : 'text-text'}`}>
                        {user.isAdmin ? 'Administrator' : 'Customer'}
                      </span>
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-text-secondary text-sm">Email Verification</p>
                    <p className="text-text font-medium">
                      <span className={`status-badge ${user.isVerified ? 'success' : 'error'}`}>
                        {user.isVerified ? 'Verified' : 'Not Verified'}
                      </span>
                    </p>
                  </div>
                </div>
                
                <hr className="my-6 border-gray-100" />
                
                <h3 className="text-lg font-semibold text-text mb-6">Address Information</h3>
                
                {user.address ? (
                  <div className="p-4 border border-border rounded-lg">
                    <p className="flex items-start">
                      <RiMapPinLine className="mr-2 mt-1 text-text-secondary" />
                      <span>
                        {user.address.street}<br />
                        {user.address.city}, {user.address.state} {user.address.postalCode}<br />
                        {user.address.country}
                      </span>
                    </p>
                  </div>
                ) : (
                  <p className="text-text-secondary">No address information available</p>
                )}
                
                <hr className="my-6 border-gray-100" />
                
                <h3 className="text-lg font-semibold text-text mb-6">Account Activity</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-text-secondary text-sm">Registration Date</p>
                    <p className="text-text font-medium flex items-center">
                      <RiCalendarLine className="mr-2 text-text-secondary" /> {formatDate(user.createdAt)}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-text-secondary text-sm">Last Login</p>
                    <p className="text-text font-medium flex items-center">
                      <RiCalendarLine className="mr-2 text-text-secondary" /> {formatDate(user.lastLogin)}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-text-secondary text-sm">Total Orders</p>
                    <p className="text-text font-medium flex items-center">
                      <RiShoppingBag3Line className="mr-2 text-text-secondary" /> {userOrders.length}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-text">Order History</h2>
                  <span className="text-text-secondary text-sm">{userOrders.length} orders</span>
                </div>
                
                {userOrders.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <RiShoppingCartLine className="mx-auto h-12 w-12 text-text-secondary mb-4" />
                    <h3 className="text-lg font-medium text-text mb-2">No Orders Yet</h3>
                    <p className="text-text-secondary">This user hasn't placed any orders yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="apple-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Date</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userOrders.map((order) => (
                          <tr key={order._id} className="stagger-item">
                            <td className="font-medium">#{order._id}</td>
                            <td>{formatDate(order.createdAt).split(',')[0]}</td>
                            <td>{formatCurrency(order.totalPrice)}</td>
                            <td>
                              <span className={`status-badge ${getStatusColorClass(order.status)}`}>
                                {order.status}
                              </span>
                            </td>
                            <td>
                              <Link
                                to={`/orders/${order._id}`}
                                className="text-accent hover:text-accent-hover text-sm font-medium"
                              >
                                View
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
            
            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-text mb-6">Account Settings</h2>
                
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-text mb-1">Account Status</h3>
                        <p className="text-text-secondary text-sm">Change the user's account status</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUpdateUserStatus('active')}
                          disabled={updating || user.status === 'active'}
                          className={`px-4 py-2 rounded-lg text-sm ${
                            user.status === 'active'
                              ? 'bg-success text-white cursor-default'
                              : 'bg-gray-100 text-text hover:bg-gray-200'
                          }`}
                        >
                          <RiCheckLine className={user.status === 'active' ? "mr-1 inline-block" : "hidden"} />
                          Active
                        </button>
                        <button
                          onClick={() => handleUpdateUserStatus('inactive')}
                          disabled={updating || user.status === 'inactive'}
                          className={`px-4 py-2 rounded-lg text-sm ${
                            user.status === 'inactive'
                              ? 'bg-error text-white cursor-default'
                              : 'bg-gray-100 text-text hover:bg-gray-200'
                          }`}
                        >
                          <RiCloseLine className={user.status === 'inactive' ? "mr-1 inline-block" : "hidden"} />
                          Inactive
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-text mb-1">Admin Privileges</h3>
                        <p className="text-text-secondary text-sm">Grant or revoke admin permissions</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUpdateAdminStatus(true)}
                          disabled={updating || user.isAdmin}
                          className={`px-4 py-2 rounded-lg text-sm ${
                            user.isAdmin
                              ? 'bg-accent text-white cursor-default'
                              : 'bg-gray-100 text-text hover:bg-gray-200'
                          }`}
                        >
                          <RiCheckLine className={user.isAdmin ? "mr-1 inline-block" : "hidden"} />
                          Make Admin
                        </button>
                        <button
                          onClick={() => handleUpdateAdminStatus(false)}
                          disabled={updating || !user.isAdmin}
                          className={`px-4 py-2 rounded-lg text-sm ${
                            !user.isAdmin
                              ? 'bg-accent text-white cursor-default'
                              : 'bg-gray-100 text-text hover:bg-gray-200'
                          }`}
                        >
                          <RiCloseLine className={!user.isAdmin ? "mr-1 inline-block" : "hidden"} />
                          Remove Admin
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-text mb-1">Reset Password</h3>
                        <p className="text-text-secondary text-sm">Send a password reset link to user's email</p>
                      </div>
                      <button className="btn-secondary text-sm px-4 py-2">
                        <RiLockLine className="mr-1 inline-block" />
                        Send Reset Link
                      </button>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-6">
                    <button className="bg-red-50 text-error px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-red-100 transition-colors">
                      <RiAlertLine className="mr-2" />
                      Delete User Account
                    </button>
                    <p className="text-text-secondary text-xs mt-2">
                      This action is permanent and cannot be undone. All user data will be permanently removed.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPage;
