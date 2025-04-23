const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const httpStatus = require('http-status');

// Import routes
const restaurantRoutes = require('./routes/restaurant.routes');
const menuItemRoutes = require('./routes/menuItem.routes');

const app = express();

// Enable CORS
app.use(cors());
app.options('*', cors());

// Parse JSON request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(httpStatus.OK).json({ status: 'OK', message: 'Restaurant service is healthy' });
});

// API routes
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu-items', menuItemRoutes);

// Handle 404 - Not Found
app.use((req, res, next) => {
  res.status(httpStatus.NOT_FOUND).json({
    status: 'error',
    message: 'Not Found',
    errors: [{
      message: `Cannot ${req.method} ${req.url}`,
    }],
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  const status = err.status || httpStatus.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    status: 'error',
    message,
    errors: err.errors || [],
  });
});

module.exports = app;