/**
 * API utility functions for making requests to the backend
 */

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Handles fetch requests with proper error handling
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} Response data
 */
export const fetchData = async (endpoint, options = {}) => {
  const token = localStorage.getItem('adminToken');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    // Check for authentication errors
    if (response.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminInfo');
      window.location.href = '/login';
      throw new Error('Authentication failed. Please login again.');
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

/**
 * Login admin user
 * @param {Object} credentials - Admin credentials
 * @returns {Promise<Object>} Admin user data with token
 */
export const loginAdmin = async (credentials) => {
  return fetchData('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

/**
 * Get dashboard statistics
 * @returns {Promise<Object>} Dashboard statistics
 */
export const getDashboardStats = async () => {
  return fetchData('/api/admin/dashboard');
};

/**
 * Get all users
 * @returns {Promise<Array>} List of users
 */
export const getUsers = async () => {
  return fetchData('/api/admin/users');
};

/**
 * Get user details by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User details
 */
export const getUserById = async (userId) => {
  return fetchData(`/api/admin/users/${userId}`);
};

/**
 * Get orders for a specific user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} List of user orders
 */
export const getUserOrders = async (userId) => {
  return fetchData(`/api/admin/users/${userId}/orders`);
};

/**
 * Get all orders
 * @returns {Promise<Array>} List of all orders
 */
export const getOrders = async () => {
  return fetchData('/api/admin/orders');
};

/**
 * Get order details by ID
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} Order details
 */
export const getOrderById = async (orderId) => {
  return fetchData(`/api/admin/orders/${orderId}`);
};

/**
 * Update order status
 * @param {string} orderId - Order ID
 * @param {Object} updateData - Data to update (status, isDelivered)
 * @returns {Promise<Object>} Updated order
 */
export const updateOrderStatus = async (orderId, updateData) => {
  return fetchData(`/api/admin/orders/${orderId}/status`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  });
};
