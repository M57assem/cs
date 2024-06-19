const DB = require('../data/ESP32');
const ApiError = require('../utilis/handler');


const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// to get data from ESP32
const saveSensorData = async (req, res, next) => {
    const { DHT11, MAX30105 } = req.body;

    try {
        // Check if there's any existing data (assuming a single document approach)
        const sensorData = await DB.findOne();

        if (sensorData) {
            // Update existing document
            if (DHT11) {
                sensorData.DHT11 = DHT11;
            }
            if (MAX30105) {
                sensorData.MAX30105 = MAX30105;
            }
            sensorData.timestamp = Date.now(); // Update timestamp

            const updatedData = await sensorData.save();
            if (updatedData) {
                res.status(200).json({ message: "Data updated successfully" });
            } else {
                throw new Error("Failed to update data");
            }
        } else {
            // Create new document
            sensorData = new DB({
                DHT11,
                MAX30105,
            });

            const savedData = await DB.save();
            if (savedData) {
                res.status(201).json({ message: "Data saved successfully" });
            } else {
                throw new Error("Failed to save data");
            }
        }
    } catch (err) {
        next(err); // Pass error to Express error handling middleware
    }


  
  


  

   

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
