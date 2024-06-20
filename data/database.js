const mongoose = require('mongoose');
const validator = require('validator')
const authschema = new mongoose.Schema({

Name:{
    type: String,
    required:true

},
 Email: {
    type: String,
    required: true,
    unique: true,
    trim: true, // Trim whitespace from input
    lowercase: true, // Store emails in lowercase to ensure case insensitivity
    validate: [validator.isEmail, 'Invalid email format']
  }
,
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
},

verified: {
    type: Boolean,
    default: false
}, 

photo: {
    type: String,  
},
 

role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
},



});
module.exports = mongoose.model('smart',authschema);
