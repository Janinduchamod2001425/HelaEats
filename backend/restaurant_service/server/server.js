const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');

mongoose.connect(config.mongoose.url, config.mongoose.options)
  .then(() => {
    console.log('Connected to MongoDB');
    const port = config.port || 3001;
    app.listen(port, () => {
      console.log(`Restaurant service running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });