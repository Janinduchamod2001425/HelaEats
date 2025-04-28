const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const config = require('./config/config');

// Import routes
const restaurantRoutes = require('./routes/restaurant.routes');
const menuItemRoutes = require('./routes/menuItem.routes');
const { verifyRestaurantAdmin } = require('./middleware/restaurant.middleware');

// Initialize Express app
const app = express();

// Enhanced CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173', // Your frontend origin
  credentials: true, // Allow credentials (cookies, auth headers)
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-id']
};

// Middleware
app.use(cors(corsOptions)); // Apply CORS with options
app.options('*', cors(corsOptions)); // Handle preflight requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Add headers to responses
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(httpStatus.OK).json({ 
    status: 'OK', 
    message: 'Restaurant service is healthy',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu-items', menuItemRoutes);
app.use('/api/restaurants/:id', verifyRestaurantAdmin);

// 404 Handler
app.use((req, res) => {
  res.status(httpStatus.NOT_FOUND).json({
    status: 'error',
    message: 'Not Found',
    errors: [{
      resource: req.originalUrl,
      message: `Cannot ${req.method} ${req.url}`
    }],
    timestamp: new Date().toISOString()
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  const status = err.status || httpStatus.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Internal Server Error';
  
  res.status(status).json({
    status: 'error',
    message,
    errors: err.errors || [],
    timestamp: new Date().toISOString(),
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Database connection and server start
mongoose.connect(config.mongoose.url, config.mongoose.options)
  .then(() => {
    console.log('Connected to MongoDB');
    const server = app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.log(`Port ${config.port} is in use, trying port ${Number(config.port) + 1}`);
        app.listen(Number(config.port) + 1);
      } else {
        console.error('Server error:', error);
        process.exit(1);
      }
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });