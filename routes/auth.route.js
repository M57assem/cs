const express = require('express');
const router = express.Router();
const multer = require('multer');
const ApiError = require('../utilis/handler');



const as= require('../controller/auth.controller')


const {SignupValidator ,LoginValidator,resetPassword} = require('../utilis/Validators/AuthValidator')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Uploads will be stored in the 'uploads/' directory
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        const filename = `user-${Date.now()}.${ext}`; // Corrected filename template
        cb(null, filename);
    }
});

const fileFilter = (req, file, cb) => {
    const imagetype = file.mimetype.split('/')[0];
    if (imagetype === 'image') {
        cb(null, true);
    } else {
        cb(new ApiError('Please upload an image only', 400), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.route('/:id')
.get(as.GetUsers)


router.route('/Signup')
.post( upload.single('photo'),SignupValidator, as.signup);

router.route('/login')
.post(LoginValidator,as.login)
 
router.route('/verify/:token')
.get(as.VerifyEmail)

router.route('/forget')
.post(as.ForgetPassword)

router.route('/PasswordForm/:token')
.get(as.PasswordForm)

router.route('/forget/:token')
.post(resetPassword,as.resetPassword)

router.route('/update/:token')
.patch(as.update)

router.route('/:id/delete/:token')
.delete(as.Delete)

router.route('/uploadPhoto/:id')
.patch(upload.single('photo'), as.uploadPhoto);




module.exports = router;
