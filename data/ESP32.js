const mongoose = require('mongoose');
const authschema = new mongoose.Schema({

//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'smart',
//     required: true
// },
    timestamp: { 
        type: Date, 
        default: Date.now 
      }, // Automatically sets the current date and time when a new document is created
    
      GPS: {
        type: String,
           default: '29.982704, 31.282639' // Default GPS coordinates
     
      },
      
    
      Temperature:{
          
        type: Number,

      },
      Humidity:{
          
        type: Number,

      },
      HeartRate:{
          
        type: Number,

      },

      Spo2:{
          
        type: Number,

      },


      
    
  

});
module.exports = mongoose.model('SensorData',authschema);
