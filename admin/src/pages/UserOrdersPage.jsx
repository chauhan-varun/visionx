import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';
import { motion } from 'framer-motion';
import AdminLayout from '../components/AdminLayout';
import { getUserById, getUserOrders } from '../utils/api';

const UserOrdersPage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch user details and orders in parallel
        const [userData, ordersData] = await Promise.all([
          getUserById(userId),
          getUserOrders(userId)
        ]);
        
        setUser(userData);
        setOrders(ordersData);
      } catch (err) {
        // Handle authentication errors
        if (err.message.includes('Authentication failed')) {
          // The api utility will redirect to login
          return;
        }
        
        setError(err.message || 'Failed to load user orders');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserOrders();
    }
  }, [userId, navigate]);

  const handleViewOrderDetails = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  const handleBackToUser = () => {
    navigate(`/users/${userId}`);
  };

  // Format date in a more readable way
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <SyncLoader color="#3B82F6" size={15} margin={6} />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" 
          role="alert"
        >
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
          <div className="mt-4 flex space-x-3">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
              onClick={() => window.location.reload()}
            >
              Try Again
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
              onClick={() => navigate('/users')}
            >
              Back to All Users
            </motion.button>
          </div>
        </motion.div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Orders for {user?.name || 'User'}
            </h1>
            <p className="text-gray-600">{user?.email || ''}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBackToUser}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm transition duration-300 ease-in-out self-start"
          >
            Back to User Details
          </motion.button>
        </div>
        
        {/* Desktop view - Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg shadow-md overflow-hidden hidden md:block"
        >
          {orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Delivery Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order, index) => (
                    <motion.tr 
                      key={order._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order._id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{order.totalPrice?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.isPaid 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.isPaid ? `Paid (${formatDate(order.paidAt)})` : 'Not Paid'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.isDelivered 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.isDelivered 
                            ? `Delivered (${formatDate(order.deliveredAt)})` 
                            : 'Not Delivered'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <motion.button
                          whileHover={{ scale: 1.05, color: '#1E40AF' }}
                          onClick={() => handleViewOrderDetails(order._id)}
                          className="text-blue-600 hover:text-blue-900 transition duration-300 ease-in-out"
                        >
                          View Details
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              No orders found for this user.
            </div>
          )}
        </motion.div>

        {/* Mobile view - Cards */}
        <div className="space-y-4 md:hidden">
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-lg shadow-md overflow-hidden p-4"
                whileHover={{ 
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)"
                }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Order #{order._id.substring(0, 8)}</h3>
                    <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleViewOrderDetails(order._id)}
                    className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700 transition duration-300"
                  >
                    View
                  </motion.button>
                </div>
                
                <div className="mb-3">
                  <p className="text-xs text-gray-500 font-medium">Total</p>
                  <p className="text-blue-600 font-bold text-sm">₹{order.totalPrice?.toFixed(2)}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 font-medium">Payment Status</span>
                    <span className={`mt-1 px-2 py-1 rounded-full text-xs inline-flex items-center w-fit ${
                      order.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.isPaid ? `Paid (${formatDate(order.paidAt)})` : 'Not Paid'}
                    </span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 font-medium">Delivery Status</span>
                    <span className={`mt-1 px-2 py-1 rounded-full text-xs inline-flex items-center w-fit ${
                      order.isDelivered ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.isDelivered ? `Delivered (${formatDate(order.deliveredAt)})` : 'Not Delivered'}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white p-4 rounded-lg shadow text-center"
            >
              No orders found for this user.
            </motion.div>
          )}
        </div>
      </motion.div>
    </AdminLayout>
  );
};

export default UserOrdersPage;
