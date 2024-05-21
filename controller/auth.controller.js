const express = require('express');


const bcrypt = require('bcryptjs');
const DB = require('../data/database');
const asyHchandler =require('express-async-handler')
const { Db } = require('mongodb');
const jwt = require('jsonwebtoken');
const ApiError = require('../utilis/handler');
const {sendEmailTo} = require('../email/SendEmail');





const GetUsers =  asyHchandler(async(req,res,next)=>{

 

    const users = await DB.find({},{"__v":false,"confirmPassword":false, "_id":false});
    if(users.length ===0 ){
      return next(new ApiError("Null !!!",500));
    }  
    
    
    res.json(users);
     
});




 
  const login = asyHchandler( async (req, res , next) => {
 
    const { Email , Password } = req.body;

    if(!Email && !Password){
      return next(new ApiError("Wrong email and passwordare required!",404));
    }
    const findUser = await DB.findOne({ Email });

    if (!findUser) {
      return next(new ApiError("Wrong email or password 111111111!",404));
    }

    if(findUser.verified){

    const passwordMatch = await bcrypt.compare(Password, findUser.Password);
    
    if(passwordMatch) {
        res.status(200).send( ' Logged in successfully!')
        
    }else{
      return next(new ApiError("Wrong email or password 2222222!",404));
    }
  }else{
    return next(new ApiError("please verify your email !!",404));
  }
  });

  


// need to understand


  const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };


  
const signup = asyncHandler(async (req, res, next) => {
  const { Name, Email, Password, confirmPassword, Wight, Lenght , role } = req.body;

  const findUser = await DB.findOne({ Email });

  if (findUser) {
    return next(new ApiError("Email already exists", 404));
  }

  const hashedPassword = await bcrypt.hash(Password, 10);

  const newUser = new DB({ Name, Email, Password: hashedPassword, confirmPassword, Wight, Lenght });

  const token = jwt.sign({ email: newUser.Email, id: newUser._id }, process.env.JWT_SECRET_KEY);
  newUser.token = token;

  if (await newUser.save()) {
    // Send confirmation email
    const link =   `http://localhost:6542/api/users/verify/${token}`
    const result = await sendEmailTo(newUser, link);

    if (result.success) {
      res.status(201).send("Registered successfully!");
    } else {
      console.error(result.message, result.error);
      return next(new ApiError("Error sending email", 500));
    }
  } else {
    console.error("Error signing up user:", error);
    return next(new ApiError("Something went wrong", 500));
  }
});

const path = require('path')
const VerifyEmail = async (req, res, next) => {
  try {
    // Verify the token
    const decodedToken = jwt.verify(req.params.token, process.env.JWT_SECRET_KEY);
    // Retrieve user from the database
    const user = await DB.findOne({ _id: decodedToken.id });
    if (!user) {
      // If user is not found, throw a 404 error
      throw new ApiError("Something wrong", 404);
    }
    // Update the user record in the database to mark it as verified
    
    user.verified = true;
    await user.save();
    // Send a success response
   
    res.sendFile(path.join(__dirname, '../index.html'));


    // console.log("aaaaaaaa");

    
  } catch (error) {
    // Pass the error to the error handling middleware
    next(error);
  }
};

const ForgetPassword = asyncHandler(async (req, res, next) => {
const {Email} = req.body;
const findUser = await DB.findOne({ Email });

if (!findUser) {
  return next(new ApiError("Sorry Your Email is wrong", 404));
}
const token = jwt.sign({ email: findUser.Email, id: findUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '10m' });

const link =  `https://barclete88.onrender.com/api/users/forget/${token}`
const result = await sendEmailTo(findUser, link);

if (result.success) {
  res.status(201).send("Link Send");

}
})

const resetPassword = asyncHandler(async (req, res, next) => {
  const { Password  , confirmPassword} = req.body;

  const decodedToken = jwt.verify(req.params.token, process.env.JWT_SECRET_KEY);
  

  const user = await DB.findOne({ _id: decodedToken.id });

  if (!user) {
      // If user is not found, throw a 404 error
      throw new ApiError("User not found", 404);
  }

  const hashedPassword = await bcrypt.hash(Password, 10);
  console.log("Apply Hashpassword");
  const updatedUser = await DB.findOneAndUpdate(
      { _id: decodedToken.id },
      { Password : hashedPassword , confirmPassword : confirmPassword },
      { new: true }
  );
  res.json("Update Success");
});

const update = asyncHandler(async (req, res) => {
  
    // Verify JWT token
    const decodedToken = jwt.verify(req.params.token, process.env.JWT_SECRET_KEY);

    // Find user by ID
    const user = await DB.findOne({ _id: decodedToken.id });

    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Update user
    
    const updatedUser = await DB.findOneAndUpdate(
      { _id: decodedToken.id },
      req.body, // Assuming req.body contains the updated user information
      { new: true } // Return the updated user document
    );

    if(updatedUser){
    // Send response
    res.json({ message: 'Update Success', user: updatedUser });
    }else{
    // Handle errors
  
    return new ApiError("Update failed", 404);
    }
});



  // get update parameters from request
  module.exports ={
    GetUsers,
    signup,
    login,
    VerifyEmail,
    ForgetPassword,
    resetPassword,
    update
    
    
}
