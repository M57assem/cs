const express = require('express');
const app = express();
const asyncHandler = require('express-async-handler');
const ApiError = require('./utilis/handler');
const globalError = require('./middleware/ErrorGlobal');
const dbConnection = require('./mongoose/database');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');

// Load environment variables
dotenv.config({ path: 'config.env' });

// Database connection
dbConnection();

// Middlewares
app.use(cors());
app.use(express.json());

// Static file serving
app.use('/public', express.static('public'));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
const authRouter = require('./routes/auth.route');
app.use('/api/users', authRouter);

// 404 handling
app.all('*', (req, res, next) => {
  return next(new ApiError(`Can't find this route`, 400));
});

// Global error handling middleware
app.use(globalError);

// Start server
const port = 6542;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Handle rejection outside express
process.on('unhandledRejection', (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});
