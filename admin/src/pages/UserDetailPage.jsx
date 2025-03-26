import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';
import { motion } from 'framer-motion';
import AdminLayout from '../components/AdminLayout';
import { getUserById } from '../utils/api';

const UserDetailPage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getUserById(userId);
        setUser(data);
      } catch (err) {
        // Handle authentication errors
        if (err.message.includes('Authentication failed')) {
          // The api utility will redirect to login
          return;
        }
        
        setError(err.message || 'Failed to load user details');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserDetails();
    }
  }, [userId, navigate]);

  // Format date in a more readable way
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleViewOrders = () => {
    navigate(`/users/${userId}/orders`);
  };

  const handleBackToUsers = () => {
    navigate('/users');
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
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 transition duration-300 ease-in-out"
            onClick={() => window.location.reload()}
          >
            Try Again
          </motion.button>
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
          <h1 className="text-2xl font-bold text-gray-800">User Details</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBackToUsers}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm transition duration-300 ease-in-out"
          >
            Back to Users
          </motion.button>
        </div>
        
        {user ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
            whileHover={{ boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)" }}
          >
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-gray-50 p-4 rounded-lg sm:bg-transparent sm:p-0"
                >
                  <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                  <div className="space-y-3">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                      className="bg-white sm:bg-transparent p-3 sm:p-0 rounded-md shadow-sm sm:shadow-none"
                    >
                      <p className="text-sm text-gray-500 font-medium">User ID</p>
                      <p className="text-gray-900 text-sm break-words">{user._id}</p>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 }}
                      className="bg-white sm:bg-transparent p-3 sm:p-0 rounded-md shadow-sm sm:shadow-none"
                    >
                      <p className="text-sm text-gray-500 font-medium">Name</p>
                      <p className="text-gray-900">{user.name}</p>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.6 }}
                      className="bg-white sm:bg-transparent p-3 sm:p-0 rounded-md shadow-sm sm:shadow-none"
                    >
                      <p className="text-sm text-gray-500 font-medium">Email</p>
                      <p className="text-gray-900 break-words">{user.email}</p>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.7 }}
                      className="bg-white sm:bg-transparent p-3 sm:p-0 rounded-md shadow-sm sm:shadow-none"
                    >
                      <p className="text-sm text-gray-500 font-medium">Admin Status</p>
                      <p className="text-gray-900">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.isAdmin ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.isAdmin ? 'Admin' : 'Customer'}
                        </span>
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-gray-50 p-4 rounded-lg sm:bg-transparent sm:p-0"
                >
                  <h2 className="text-xl font-semibold mb-4">Account Information</h2>
                  <div className="space-y-3">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                      className="bg-white sm:bg-transparent p-3 sm:p-0 rounded-md shadow-sm sm:shadow-none"
                    >
                      <p className="text-sm text-gray-500 font-medium">Date Joined</p>
                      <p className="text-gray-900">{formatDate(user.createdAt)}</p>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 }}
                      className="bg-white sm:bg-transparent p-3 sm:p-0 rounded-md shadow-sm sm:shadow-none"
                    >
                      <p className="text-sm text-gray-500 font-medium">Last Updated</p>
                      <p className="text-gray-900">{formatDate(user.updatedAt)}</p>
                    </motion.div>
                  </div>
                  
                  <div className="mt-8">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleViewOrders}
                      className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm transition duration-300 ease-in-out"
                    >
                      View User Orders
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No user data available
          </div>
        )}
      </motion.div>
    </AdminLayout>
  );
};

export default UserDetailPage;
