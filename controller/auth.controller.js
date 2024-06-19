const express = require('express');


const bcrypt = require('bcryptjs');
const DB = require('../data/database');
const asyHchandler =require('express-async-handler')
const { Db } = require('mongodb');
const jwt = require('jsonwebtoken');
const ApiError = require('../utilis/handler');
const {sendEmailTo} = require('../email/SendEmail');
const {resetEmail} = require('../email/sendmail');


// need to understand


  const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };


//Allow only to Admin

const GetUsers = asyncHandler(async (req, res, next) => {
  const userId = req.params.id.trim();

  // Check the role of the user first
  const user = await DB.findOne({ _id: userId });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (user.role !== 'admin') {
    return next(new ApiError("Sorry, you do not have access", 404));
  }

  // Now fetch all users
  const users = await DB.find({}, { "__v": false});
  if (users.length === 0) {
    return next(new ApiError("No users found", 404));
  }

  res.json(users);
});

const Delete = asyncHandler(async (req, res, next) => {
  const userId = req.params.id.trim();
  const token = req.params.token.trim();

  // Check if token is provided
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  // Find the admin user by ID
  const adminUser = await DB.findById(userId);

  // Check if admin user exists
  if (!adminUser) {
    return res.status(404).json({ message: "Admin user not found" });
  }

  // Check if the admin identified by userId is not an admin
  if (adminUser.role !== 'admin') {
    return res.status(403).json({ message: "Forbidden: You don't have permission to delete" });
  }

  // Find the user by token
  const userToDelete = await DB.findOneAndDelete({ token: token });

  // Check if user to delete exists
  if (!userToDelete) {
    return res.status(404).json({ message: "User not found" });
  } 
  
  res.status(200).json({ message: "User deleted successfully" });
});





 
const login = async (req, res, next) => {
  const { Email, Password } = req.body;

  if (!Email || !Password) {
    return next(new ApiError("Email and password are required!", 404));
  }

  const findUser = await DB.findOne({ Email });

  if (!findUser) {
    return next(new ApiError("Wrong email or password!", 404));
  }

  if (!findUser.verified) {
    return next(new ApiError("Please verify your email!", 404));
  }

  const passwordMatch = await bcrypt.compare(Password, findUser.Password);

   if (passwordMatch) {
    // Generate a new token
     
      const token = jwt.sign(
        { email: findUser.Email, userId: findUser._id },
        process.env.JWT_SECRET_KEY
      );

      // Update user's token in the database
     
      findUser.token = token;
      await findUser.save();
  
    // Send response with token and additional user data
    return res.status(200).json({
      message: 'Logged in successfully!',
      token: token,
      username: findUser.Name,    // Change this according to your user schema
      id: findUser._id,
      role: findUser.role
    });
  } else {
    return next(new ApiError("Wrong email or password!", 404));
  }
};

  
const signup = asyncHandler(async (req, res, next) => {
  const { Name, Email, Password, confirmPassword, Wight, Lenght , role } = req.body;
  const photo = req.file ? req.file.filename : '';

  const findUser = await DB.findOne({ Email });

  if (findUser) {
    return next(new ApiError("Email already exists", 404));
  }

  const hashedPassword = await bcrypt.hash(Password, 10);

  const newUser = new DB({ Name, Email, Password: hashedPassword, Wight, Lenght,role: role || 'user', photo });

  const token = jwt.sign({ email: newUser.Email, id: newUser._id }, process.env.JWT_SECRET_KEY,);
  newUser.token = token;

  if (await newUser.save()) {
    // Send confirmation email
   const link =   `https://barclete88.onrender.com/api/users/verify/${token}`
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




const uploadPhoto = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;

  // Check if file is uploaded
  if (!req.file) {
      return next(new ApiError("No file uploaded", 400));
  }

  const photo = req.file.filename;

  // Find user and update the photo field
  const updatedUser = await DB.findByIdAndUpdate(
      userId,
      { photo: photo },
      { new: true }
  );

  if (!updatedUser) {
      return next(new ApiError("User not found", 404));
  }

  res.status(200).json({
      message: 'Photo uploaded successfully!',
      photo: updatedUser.photo
  });
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
 
    // Redirect the user to the index.html page in the public directory
    res.redirect('/index.html');
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
const token = jwt.sign({ email: findUser.Email, id: findUser._id }, process.env.JWT_SECRET_KEY );

const link =   `https://barclete88.onrender.com/api/users/PasswordForm/${token}`
const result = await resetEmail(findUser, link);

if (result.success) {
  res.status(201).send("Link Send");

}
})
const PasswordForm = asyncHandler(async (req, res, next) => {
  try {
    const decodedToken = jwt.verify(req.params.token, process.env.JWT_SECRET_KEY);
    const user = await DB.findOne({ _id: decodedToken.id });

    if (!user) {
      return next(new ApiError("User not found", 404));
    }

    res.sendFile(path.join(__dirname, '../forget.html'));
  } catch (error) {
    next(error);
  }
});

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
      { Password : hashedPassword  },
      { new: true }
  );
  res.json("Update Success");
});

 const update = asyncHandler(async (req, res, next) => {
    
      // Get user ID from request parameters
      const userId = req.params.id;
  
      // Check if user ID is provided
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
  
      // Find user by ID
      const user = await DB.findOne({ _id: userId });
  
      // Check if user exists
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update user
      const updatedUser = await DB.findOneAndUpdate(
        { _id: userId },
        req.body, // Assuming req.body contains the updated user information
        { new: true } // Return the updated user rrordocument
      );
  
      // Check if the update was successful
      if (updatedUser) {
        // Send response
        res.json({ message: 'Update Success' });
      } else {
        // Handle errors
        return next(new ApiError('Error',404));
      }
  
    
  });
  

 
  module.exports ={
    GetUsers,
    signup,
    login,
    VerifyEmail,
    ForgetPassword,
    PasswordForm,
    resetPassword,
    update,
    Delete,
    uploadPhoto
        
}
