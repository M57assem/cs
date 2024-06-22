const DB = require('../data/ESP32');
const ApiError = require('../utilis/handler');

const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// to get data from ESP32
const saveSensorData = async (req, res, next) => {
    let { temperatureC, Humidity, HeartRate, Spo2 } = req.body;

 
    let sensorData = await DB.findOne();

    if (sensorData) {
        // Update existing document
        sensorData.temperatureC = temperatureC;
        sensorData.Humidity = Humidity;
        sensorData.HeartRate = HeartRate;
        sensorData.Spo2 = Spo2;

        sensorData.timestamp = Date.now(); // Update timestamp

        const updatedData = await sensorData.save();
        if (updatedData) {
            res.status(200).json({ message: "Data updated successfully" });
        } else {
            return next(new ApiError("Failed to update data", 500));
        }
    } else {
        // Create new document
        sensorData = new DB({
            temperatureC,
            Humidity,
            HeartRate,
            Spo2
        });

        const savedData = await sensorData.save();
        if (savedData) {
            res.status(201).json({ message: "Data saved successfully" });
        } else {
            return next(new ApiError("Failed to save data", 500));
        }
    }
};

const getSensorDataForUser = asyncHandler(async (req, res, next) => {
    const data = await DB.find().sort({ timestamp: -1 }).limit(10);
  if(data){

        res.json(data);
    } else {
        return next(new ApiError('Data not found for this user', 404));
    }
});

const axios = require('axios');

const repeatAPI = async () => {
  try {
    const response = await axios.get('https://barclete88.onrender.com/api/data');
    const data = response.data;
    console.log({ message: 'data updated' });
    // Do something with the data
  } catch (error) {
    console.error(error);
    // Handle error
  }
};

module.exports = {
    saveSensorData,
    getSensorDataForUser,
    repeatAPI
};
