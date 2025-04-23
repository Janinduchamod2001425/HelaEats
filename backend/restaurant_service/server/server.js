const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const config = require('./config/config');

// Import routes
const restaurantRoutes = require('./routes/restaurant.routes');
const menuItemRoutes = require('./routes/menuItem.routes');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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