const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authinticate'); // Import authenticateUser middleware
const as = require('../controller/sensor.contoller');

// Register authenticateUser middleware for all routes in this router
router.route('/:id') // Route accepts user ID directly
    .get(as.getSensorDataForUser);

router.use(authenticateUser);

router.route('/')
    .post(as.saveSensorData);

module.exports = router;
