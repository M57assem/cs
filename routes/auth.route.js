const express = require('express');
const router = express.Router();


const as= require('../controller/auth.controller')

const {SignupValidator ,LoginValidator,resetPassword} = require('../utilis/Validators/AuthValidator')



  
  

router.route('/')
.get(as.GetUsers)
router.route('/Signup')
.post(SignupValidator ,as.signup)
router.route('/login')
.post(LoginValidator,as.login)
 
router.route('/verify/:token')
.get(as.VerifyEmail)

router.route('/forget')
.post(as.ForgetPassword)

router.route('/forget/:token')
.post(resetPassword,as.resetPassword)

router.route('/update/:token')
.patch(as.update)






module.exports = router;