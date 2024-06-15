const DB = require('../data/ESP32');
const ApiError = require('../utilis/handler');


const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

const saveSensorData = asyncHandler(async (req, res, next) => {
    const userId = req.userId;
    
    const data = await DB.findOne({ 'GPS.Location': req.body.GPS.Location });

    if (data) {
        // If data exists, update it
        data.DHT11 = req.body.DHT11;
        data.MAX30105 = req.body.MAX30105;
        data.timestamp = Date.now(); // Update timestamp

        const updatedData = await data.save();
        if (updatedData) {
            res.status(200).json(updatedData);
        } else {
            return next(new ApiError('Something went wrong while updating', 500));
        }
    } else {
        // If data doesn't exist, create a new entry
        const newData = new DB({
            GPS: req.body.GPS,
            DHT11: req.body.DHT11,
            MAX30105: req.body.MAX30105,
            userId: userId
        });
        const savedData = await newData.save();

        if (savedData) {
            
            res.status(201).json({ message: "Data is saved" });
        } else {
            return next(new ApiError('Something went wrong while saving', 500));
        }
    }
});

const getSensorDataForUser = asyncHandler(async (req, res, next) => {
    const userId = req.params.id;


    const data = await DB.find({ userId: userId });
    

    if (data && data.length > 0) {
        res.json(data);
    } else {
        return next(new ApiError('Data not found for this user', 404));
    }
});



module.exports = {
    saveSensorData,
    getSensorDataForUser,
};
