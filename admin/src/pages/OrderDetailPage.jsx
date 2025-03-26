import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';
import { motion } from 'framer-motion';
import AdminLayout from '../components/AdminLayout';
import { getOrderById, updateOrderStatus } from '../utils/api';

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getOrderById(orderId);
        setOrder(data);
      } catch (err) {
        // Handle authentication errors
        if (err.message && err.message.includes('Authentication failed')) {
          // The api utility will redirect to login
          return;
        }
        
        setError(err.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId, navigate]);

  const handleMarkAsDelivered = async () => {
    try {
      setUpdateLoading(true);
      setUpdateError(null);
      setUpdateSuccess(false);
      
      const updatedOrder = await updateOrderStatus(orderId, {
        isDelivered: true
      });
      
      setOrder(updatedOrder);
      setUpdateSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    } catch (err) {
      // Handle authentication errors
      if (err.message && err.message.includes('Authentication failed')) {
        // The api utility will redirect to login
        return;
      }
      
      setUpdateError(err.message || 'Failed to update order status');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleBackToOrders = () => {
    navigate('/orders');
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
              onClick={handleBackToOrders}
            >
              Back to Orders
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Order Details: #{order?._id?.substring(0, 8)}
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBackToOrders}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm transition duration-300 ease-in-out"
          >
            Back to Orders
          </motion.button>
        </div>
        
        {updateSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">Order updated successfully!</span>
          </motion.div>
        )}
        
        {updateError && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{updateError}</span>
          </motion.div>
        )}
        
        {order ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <motion.div 
              className="lg:col-span-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <motion.div 
                className="bg-white rounded-lg shadow-md overflow-hidden mb-6"
                whileHover={{ boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="px-6 py-4 border-b">
                  <h2 className="text-xl font-semibold">Order Items</h2>
                </div>
                <div className="p-6">
                  {/* Desktop view - Table */}
                  <div className="hidden md:block">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quantity
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {order.orderItems.map((item, index) => (
                          <motion.tr 
                            key={item._id || item.product}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <img
                                    className="h-10 w-10 rounded object-cover"
                                    src={item.imageUrl}
                                    alt={item.name}
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {item.name}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ₹{item.price.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.quantity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Mobile view - Cards */}
                  <div className="md:hidden space-y-4">
                    {order.orderItems.map((item, index) => (
                      <motion.div
                        key={item._id || item.product}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="bg-gray-50 rounded-lg p-4 shadow-sm"
                        whileHover={{ boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)" }}
                      >
                        <div className="flex items-center mb-3">
                          <div className="flex-shrink-0 h-16 w-16 bg-white p-1 rounded-md">
                            <img
                              className="h-full w-full rounded object-cover"
                              src={item.imageUrl}
                              alt={item.name}
                            />
                          </div>
                          <div className="ml-4 flex-1">
                            <h3 className="text-sm font-medium text-gray-900 mb-1">{item.name}</h3>
                            <p className="text-sm text-blue-600 font-bold">₹{item.price.toFixed(2)}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 text-sm border-t pt-3">
                          <div>
                            <p className="text-gray-500 font-medium">Quantity</p>
                            <p className="font-medium">{item.quantity}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 font-medium">Total</p>
                            <p className="text-blue-600 font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-lg shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)" }}
              >
                <div className="px-6 py-4 border-b">
                  <h2 className="text-xl font-semibold">Shipping Information</h2>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500">Shipping Address</h3>
                    <p className="mt-1">{order.shippingAddress.address}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Delivery Status</h3>
                    <p className="mt-1">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.isDelivered 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.isDelivered 
                          ? `Delivered on ${new Date(order.deliveredAt).toLocaleString()}` 
                          : 'Not Delivered'}
                      </span>
                    </p>
                    {!order.isDelivered && (
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleMarkAsDelivered}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-300 ease-in-out"
                      >
                        Mark as Delivered
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="lg:col-span-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.div 
                className="bg-white rounded-lg shadow-md overflow-hidden mb-6"
                whileHover={{ boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="px-6 py-4 border-b">
                  <h2 className="text-xl font-semibold">Customer Information</h2>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500">Name</h3>
                    <p className="mt-1">{order.user?.name || 'N/A'}</p>
                  </div>
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="mt-1">{order.user?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <button
                      onClick={() => navigate(`/users/${order.user?._id}`)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Customer Details
                    </button>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-lg shadow-md overflow-hidden"
                whileHover={{ boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="px-6 py-4 border-b">
                  <h2 className="text-xl font-semibold">Order Summary</h2>
                </div>
                <div className="p-6">
                  <div className="mb-4 flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="text-gray-900 font-medium">{order._id}</span>
                  </div>
                  <div className="mb-4 flex justify-between">
                    <span className="text-gray-600">Date Placed:</span>
                    <span className="text-gray-900">{new Date(order.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="mb-4 flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="text-gray-900">{order.paymentMethod}</span>
                  </div>
                  <div className="mb-4 flex justify-between">
                    <span className="text-gray-600">Payment Status:</span>
                    <span className={order.isPaid ? 'text-green-600' : 'text-yellow-600'}>
                      {order.isPaid 
                        ? `Paid on ${new Date(order.paidAt).toLocaleString()}` 
                        : 'Not Paid'}
                    </span>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-blue-600">₹{order.totalPrice?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        ) : null}
      </motion.div>
    </AdminLayout>
  );
};

export default OrderDetailPage;
