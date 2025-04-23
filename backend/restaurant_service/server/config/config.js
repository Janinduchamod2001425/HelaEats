require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5005,
  mongoose: {
    url: process.env.MONGODB_URL || 'mongodb+srv://duvidukavin:q1pFAjX1A1BcsbVT@food-system-restaurent.9ack8du.mongodb.net/?retryWrites=true&w=majority&appName=food-system-restaurent',
    options: {
      // Remove these deprecated options
      // useNewUrlParser: true,     // No longer needed in v4+
      // useUnifiedTopology: true   // No longer needed in v4+
    },
  },
};