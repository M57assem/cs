const DB = require('../data/ESP32');
const ApiError = require('../utilis/handler');


const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
  


// to get data from esp32

const GetData = asyncHandler(async (req, res, next) => {
    
 const data = new DB(req.body);
 const sensordata = await data.save()

     if(!sensordata){

        return next(new ApiError(" Something went wrong ", 404));
     }else{

        res.status(201).json({ message: "Data saved successfully" });

     }

  });



  module.exports ={

    GetData

  }
  
