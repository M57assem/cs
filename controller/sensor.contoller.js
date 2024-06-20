const DB = require('../data/ESP32');
const ApiError = require('../utilis/handler');


const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// to get data from ESP32

 
  

const saveSensorData = async (req, res, next) => {
    const { temperatureC, humidity, heartRate, spo2 } = req.body; // Extract data from request body

    // Check if there's any existing data (assuming a single document approach)
    let sensorData = await SensorData.findOne();

    if (sensorData) {
        // Update existing document
        sensorData.Temperature = temperatureC;
        sensorData.Humidity = humidity;
        sensorData.HeartRate = heartRate;
        sensorData.Spo2 = spo2;

        sensorData.timestamp = Date.now(); // Update timestamp

        try {
            const updatedData = await sensorData.save();
            res.status(200).json({ message: "Data updated successfully", data: updatedData });
        } catch (err) {
            console.error("Failed to update data:", err);
            return next(err);
        }
    } else {
        // Create new document
        sensorData = new SensorData({
            Temperature: temperatureC,
            Humidity: humidity,
            HeartRate: heartRate,
            Spo2: spo2
        });

        try {
            const savedData = await sensorData.save();
            res.status(201).json({ message: "Data saved successfully", data: savedData });
        } catch (err) {
            console.error("Failed to save data:", err);
            return next(err);
        }
    }
};

module.exports = {
    saveSensorData
};

 
   

const getSensorDataForUser = asyncHandler(async (req, res, next) => {
   


    const data = await DB.find().sort({timestamp:-1}).limit(10);
    

    if (data && data.length > 0) {
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
    console.log({message:'data updated'});
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
