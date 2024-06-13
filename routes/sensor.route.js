const express = require('express');
const router = express.Router();

const as = require('../controller/sensor.contoller');


router.route('/:token')
    .post(as.saveSensorData)
    .get( as.getSensorDataForUser);




module.exports = router;
