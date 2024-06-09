const express = require('express');
const router = express.Router();

const as = require('../controller/sensor.contoller');


router.route('/')
.post(as.GetData)



module.exports = router;
