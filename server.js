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


// Logging  // GET /api/users 200 239.216 ms - 12834 show me details 

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

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
const port = process.env.PORT 
const server = app.listen(port, () => {
  console.log(`Hello`);
});

// Handle rejection outside express
process.on('unhandledRejection', (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});
