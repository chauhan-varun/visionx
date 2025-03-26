import User from '../models/User.js';
import Order from '../models/Order.js';

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    // Get total users count
    const totalUsers = await User.countDocuments();

    // Get total orders and revenue
    const orders = await Order.find();
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);

    // Get pending orders (not paid)
    const pendingOrders = await Order.countDocuments({ isPaid: false });

    // Get new users in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Get recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(4)
      .populate('user', 'name');

    res.json({
      userCount: totalUsers,
      orderCount: totalOrders,
      totalRevenue,
      pendingOrders,
      newUsers,
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error while retrieving dashboard stats' });
  }
};
