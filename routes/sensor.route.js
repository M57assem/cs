const express = require('express');
const router = express.Router();
const as = require('../controller/sensor.contoller');

// Register authenticateUser middleware for all routes in this router
router.route('/') // Route accepts user ID directly
    .get(as.getSensorDataForUser);



router.route('/')
    .post(as.saveSensorData);

module.exports = router;
