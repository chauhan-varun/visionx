import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration with allowed origins from environment variables
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  process.env.ADMIN_URL || 'http://localhost:5174'
];

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());

// Custom Morgan logging - skip 304 responses to reduce terminal noise
app.use(morgan('dev', {
  skip: function (req, res) { 
    // Skip logging for 304 Not Modified responses
    return res.statusCode === 304;
  }
}));

// Add a basic request counter for API monitoring
const requestCounts = {
  dashboard: 0,
  users: 0,
  orders: 0
};

// Optional middleware to log only unique API calls (uncomment if preferred)
/*
app.use((req, res, next) => {
  // Only log the first request to each endpoint per server session
  if (req.path.includes('/api/admin/dashboard') && requestCounts.dashboard === 0) {
    console.log(`First request to dashboard API`);
    requestCounts.dashboard++;
  } else if (req.path.includes('/api/admin/users') && requestCounts.users === 0) {
    console.log(`First request to users API`);
    requestCounts.users++;
  } else if (req.path.includes('/api/admin/orders') && requestCounts.orders === 0) {
    console.log(`First request to orders API`);
    requestCounts.orders++;
  }
  next();
});
*/

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('VisionX API is running...');
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
