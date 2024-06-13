const DB = require('../data/ESP32');
const ApiError = require('../utilis/handler');
const jwt = require('jsonwebtoken');


const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
  



// Save data from ESP32

const saveSensorData = asyncHandler(async (req, res, next) => {
    const token = req.params.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { email, id } = decoded;

    if (!email || !id) {
        return next(new ApiError('Invalid token', 400));
    }

    const data = await DB.findOne({ 'GPS.Location': req.body.GPS.Location, userId: id });

    if (data) {
        data.DHT11 = req.body.DHT11;
        data.MAX30105 = req.body.MAX30105;
        data.timestamp = Date.now(); // Update timestamp

        const updatedData = await data.save();
        if (updatedData) {
            res.status(200).json({ message: 'Data updated successfully' });
        } else {
            return next(new ApiError('Something went wrong while updating', 500));
        }
    } else {
        const newData = new DB({
            GPS: req.body.GPS,
            DHT11: req.body.DHT11,
            MAX30105: req.body.MAX30105,
            userId: id
        });
        const savedData = await newData.save();

        if (savedData) {
            res.status(201).json({ message: 'Data saved successfully' });
        } else {
            return next(new ApiError('Something went wrong while saving', 500));
        }
    }
});



const getSensorDataForUser = asyncHandler(async (req, res, next) => {
    const token = req.params.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;

    const data = await DB.find({ userId });

    if (data) {

        res.json(data);
    } else {
        
        return next(new ApiError('Data not found', 404));
    }
});

module.exports = {
    saveSensorData,
    getSensorDataForUser,
};

