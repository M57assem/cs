const DB = require('../data/ESP32');
const ApiError = require('../utilis/handler');


const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// to get data from ESP32
const saveSensorData = asyncHandler(async (req, res, next) => {
    const { GPS, DHT11, MAX30105 } = req.body;
  
    // Example criteria for finding existing data: GPS location
    const data = await DB.findOne({ 'GPS.Location': GPS.Location });
  
    if (data) {
      // Update existing document
      data.DHT11 = DHT11;
      data.MAX30105 = MAX30105;
      data.timestamp = Date.now(); // Update timestamp
  
      const updatedData = await data.save();
      if (updatedData) {
        res.status(200).json({ message: "Data updated successfully" });
      } else {
        return next(new ApiError("Something went wrong while updating", 500));
      }
    } else {
      // Create new document
      const newData = new DB(req.body);
      const savedData = await newData.save();
  
      if (savedData) {
        res.status(201).json({ message: "Data saved successfully" });
      } else {
        return next(new ApiError("Something went wrong while saving", 500));
      }
    }
  });
  
  
  
  

   

const getSensorDataForUser = asyncHandler(async (req, res, next) => {
   


    const data = await DB.find().sort({timestamp:-1}).limit(10);
    

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
