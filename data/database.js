const mongoose = require('mongoose');
const validator = require('validator')
const authschema = new mongoose.Schema({


Name:{
    type: String,
    required:true

},

Email:{
    type: String,
    required:true,
    unique:true,
    validate: [validator.isEmail,'Sorry Email Not Valid']
},

Password:{
    type: String,
    required:true
    
},
    
Wight :{
    type: String,
    required:true,
},
Lenght:{
    type: String,
    required:true
},
token:{
    type: String,
    required:true

},
verified: {
    type: Boolean,
    default: false
},photo: String,
    
   role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
}

});


module.exports = mongoose.model('smart',authschema);
