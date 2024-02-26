const mongoose = require('mongoose');
const dbConnection = () => {
     const url = "mongodb+srv://mohamedassim2001:Mohamed572001@smart88.jeaa9op.mongodb.net/?retryWrites=true&w=majority&appName=smart88"
   
mongoose.connect(url).then(() =>{
    console.log('Connected to Database');
   
    });
}

    module.exports = dbConnection;