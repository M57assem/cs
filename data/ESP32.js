const mongoose = require('mongoose');
const authschema = new mongoose.Schema({
    timestamp: { 
        type: Date, 
        default: Date.now 
      }, // Automatically sets the current date and time when a new document is created
    GPS: {
         type: String,
            default: '29.982704, 31.282639' // Default GPS coordinates
      },
      DHT11: {
        temperature: Number,
        humidity: Number,
      },
      MAX30105: {
    Heartrate : Number,
    Spo2 : Number,
  IR : Number,
    Red : Number,
      },
    

});
module.exports = mongoose.model('SensorData',authschema);
