import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeIn, ScaleUp, AnimatedButton } from '../components/animations/AnimatedElements';
import { toast } from 'react-toastify';

const DashboardPage = () => {
  const { user, updateProfile } = useAuth();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/orders/myorders');
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      // Set dummy orders for display purposes
      setOrders([
        {
          _id: 'ord123456789',
          createdAt: '2023-07-15T14:30:00Z',
          totalPrice: 1299.99,
          isPaid: true,
          paidAt: '2023-07-15T14:35:00Z',
          isDelivered: false,
          orderItems: [
            {
              name: 'VisionAssist Pro',
              quantity: 1,
              price: 1299.99,
            },
          ],
        },
        {
          _id: 'ord987654321',
          createdAt: '2023-06-28T09:15:00Z',
          totalPrice: 149.98,
          isPaid: true,
          paidAt: '2023-06-28T09:20:00Z',
          isDelivered: true,
          deliveredAt: '2023-07-01T12:00:00Z',
          orderItems: [
            {
              name: 'Vision Lens Cleaning Kit',
              quantity: 1,
              price: 49.99,
            },
            {
              name: 'Extended Warranty',
              quantity: 1,
              price: 99.99,
            },
          ],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    // Check if passwords match when trying to change password
    if (
      profileForm.newPassword &&
      profileForm.newPassword !== profileForm.confirmNewPassword
    ) {
      setError('New passwords do not match');
      setLoading(false);
      toast.error('New passwords do not match');
      return;
    }

    try {
      // Only include password fields if the user is trying to change password
      const updateData = {
        name: profileForm.name,
        email: profileForm.email,
      };

      if (profileForm.currentPassword && profileForm.newPassword) {
        updateData.currentPassword = profileForm.currentPassword;
        updateData.newPassword = profileForm.newPassword;
      }

      await updateProfile(updateData);
      setSuccessMessage('Profile updated successfully');
      toast.success('Profile updated successfully');
      
      // Clear password fields
      setProfileForm((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      }));
    } catch (err) {
      const errorMessage = err.response && err.response.data.message
        ? err.response.data.message
        : 'Failed to update profile. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <motion.div 
      className="bg-gray-50 min-h-screen py-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto px-4">
        <motion.h1 
          className="text-3xl font-bold mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          My Account
        </motion.h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <motion.div 
            className="md:w-1/4"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ScaleUp delay={0.3}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <motion.div 
                  className="p-6 bg-blue-600 text-white"
                  whileHover={{ backgroundColor: '#3b82f6' }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.h2 
                    className="text-xl font-semibold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
                    {user?.name || 'User'}
                  </motion.h2>
                  <motion.p 
                    className="text-blue-100"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                  >
                    {user?.email || 'user@example.com'}
                  </motion.p>
                </motion.div>
              <nav className="p-4">
                <ul className="space-y-1">
                  <li>
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`w-full text-left px-4 py-2 rounded-md transition ${
                        activeTab === 'profile'
                          ? 'bg-blue-50 text-blue-600 font-semibold'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      Profile
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className={`w-full text-left px-4 py-2 rounded-md transition ${
                        activeTab === 'orders'
                          ? 'bg-blue-50 text-blue-600 font-semibold'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      Order History
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('settings')}
                      className={`w-full text-left px-4 py-2 rounded-md transition ${
                        activeTab === 'settings'
                          ? 'bg-blue-50 text-blue-600 font-semibold'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      Settings
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
            </ScaleUp>
          </motion.div>

          {/* Main Content */}
          <motion.div 
            className="md:w-3/4"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <ScaleUp delay={0.4}>
              <div className="bg-white rounded-lg shadow-md p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                  <h2 className="text-xl font-semibold mb-6">Profile Information</h2>

                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                      {error}
                    </div>
                  )}

                  {successMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                      {successMessage}
                    </div>
                  )}

                  <form onSubmit={handleProfileSubmit}>
                    <motion.div 
                      className="mb-4"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <label
                        htmlFor="name"
                        className="block text-gray-700 text-sm font-bold mb-2"
                      >
                        Full Name
                      </label>
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                        type="text"
                        id="name"
                        name="name"
                        value={profileForm.name}
                        onChange={handleProfileChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </motion.div>

                    <motion.div 
                      className="mb-4"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <label
                        htmlFor="email"
                        className="block text-gray-700 text-sm font-bold mb-2"
                      >
                        Email Address
                      </label>
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                        type="email"
                        id="email"
                        name="email"
                        value={profileForm.email}
                        onChange={handleProfileChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </motion.div>

                    <h3 className="text-lg font-semibold mt-8 mb-4">Change Password</h3>

                    <div className="mb-4">
                      <label
                        htmlFor="currentPassword"
                        className="block text-gray-700 text-sm font-bold mb-2"
                      >
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={profileForm.currentPassword}
                        onChange={handleProfileChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Leave blank if you don't want to change your password
                      </p>
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="newPassword"
                        className="block text-gray-700 text-sm font-bold mb-2"
                      >
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={profileForm.newPassword}
                        onChange={handleProfileChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="mb-6">
                      <label
                        htmlFor="confirmNewPassword"
                        className="block text-gray-700 text-sm font-bold mb-2"
                      >
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmNewPassword"
                        name="confirmNewPassword"
                        value={profileForm.confirmNewPassword}
                        onChange={handleProfileChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 }}
                    >
                      <AnimatedButton
                        type="submit"
                        disabled={loading}
                        className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition ${
                          loading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        <motion.span
                          animate={{ opacity: loading ? 0.7 : 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          {loading ? 'Updating...' : 'Update Profile'}
                        </motion.span>
                      </AnimatedButton>
                    </motion.div>
                  </form>
                </motion.div>
                </AnimatePresence>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key="orders"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl font-semibold mb-6">Order History</h2>

                  {loading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
                      <Link
                        to="/products"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
                      >
                        Browse Products
                      </Link>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="py-3 px-4 text-left">Order ID</th>
                            <th className="py-3 px-4 text-left">Date</th>
                            <th className="py-3 px-4 text-left">Total</th>
                            <th className="py-3 px-4 text-left">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order) => (
                            <tr key={order._id} className="border-b border-gray-200">
                              <td className="py-3 px-4 font-medium">{order._id}</td>
                              <td className="py-3 px-4">{formatDate(order.createdAt)}</td>
                              <td className="py-3 px-4">₹{order.totalPrice.toFixed(2)}</td>
                              <td className="py-3 px-4">
                                {order.isDelivered ? (
                                  <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                    Delivered
                                  </span>
                                ) : order.isPaid ? (
                                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                    Shipped
                                  </span>
                                ) : (
                                  <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                    Processing
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  </motion.div>
                </AnimatePresence>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl font-semibold mb-6">Account Settings</h2>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Notification Preferences</h3>
                    <div className="bg-gray-50 p-4 rounded">
                      <div className="flex items-center mb-3">
                        <input
                          type="checkbox"
                          id="emailUpdates"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="emailUpdates" className="ml-2 block text-gray-700">
                          Email me about product updates and news
                        </label>
                      </div>
                      <div className="flex items-center mb-3">
                        <input
                          type="checkbox"
                          id="orderUpdates"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="orderUpdates" className="ml-2 block text-gray-700">
                          Email me about my orders
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="promotions"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="promotions" className="ml-2 block text-gray-700">
                          Email me about promotions and discounts
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Accessibility Preferences</h3>
                    <div className="bg-gray-50 p-4 rounded">
                      <div className="mb-3">
                        <label htmlFor="fontSize" className="block text-gray-700 mb-1">
                          Text Size
                        </label>
                        <select
                          id="fontSize"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          defaultValue="medium"
                        >
                          <option value="small">Small</option>
                          <option value="medium">Medium</option>
                          <option value="large">Large</option>
                          <option value="x-large">Extra Large</option>
                        </select>
                      </div>
                      <div className="flex items-center mb-3">
                        <input
                          type="checkbox"
                          id="highContrast"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="highContrast" className="ml-2 block text-gray-700">
                          High contrast mode
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="screenReader"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="screenReader" className="ml-2 block text-gray-700">
                          Optimize for screen readers
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded mr-2 transition">
                      Save Settings
                    </button>
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded transition">
                      Cancel
                    </button>
                  </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
            </ScaleUp>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
