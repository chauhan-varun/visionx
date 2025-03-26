import express from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/authController.js';
import {
  getOrders,
  getOrderByIdAdmin,
  updateOrderStatus,
  getOrdersByUserId,
} from '../controllers/orderController.js';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Dashboard route (admin only)
router.route('/dashboard').get(protect, admin, getDashboardStats);

// User routes (admin only)
router.route('/users').get(protect, admin, getUsers);
router.route('/users/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);
router.route('/users/:id/orders').get(protect, admin, getOrdersByUserId);

// Order routes (admin only)
router.route('/orders').get(protect, admin, getOrders);
router.route('/orders/:id').get(protect, admin, getOrderByIdAdmin);
router.route('/orders/:id/status').put(protect, admin, updateOrderStatus);

export default router;
