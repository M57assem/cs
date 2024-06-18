const express = require('express');
const router = express.Router();
const as = require('../controller/sensor.contoller');
const { repeatAPI } = require('../controller/sensor.contoller');



router.route('/')
  .get(as.getSensorDataForUser)
  .post(as.saveSensorData);

// Call repeatAPI every 2 minutes
setInterval(repeatAPI, 1 * 60 * 1000);

module.exports = router;
