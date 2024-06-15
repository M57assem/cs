const mongoose = require('mongoose');
const authschema = new mongoose.Schema({
     userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'smart',
    required: true
},
    timestamp: { 
        type: Date, 
        default: Date.now 
      }, // Automatically sets the current date and time when a new document is created
    GPS: {
        Location: String, 
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
