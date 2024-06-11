const { check } = require('express-validator');
const ErrorValidation = require('../../middleware/ErrorValidation');


exports.SignupValidator = [
  check('Name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 3 }).withMessage('Name is too short')
    .isLength({ max: 20 }).withMessage('Name is too long'),

  check('Email')
    .notEmpty().withMessage('Email is required'),

  check('Password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password is too short')
    .isLength({ max: 20 }).withMessage('Password is too long'),

  check('confirmPassword')
    .notEmpty().withMessage('ConfirmPassword is required')
    .custom((value, { req }) => {
      if (value !== req.body.Password) {
        throw new Error('Password confirmation does not match password');
      }
      return true; // Validation passed
    }),

  check('Wight')
    .notEmpty().withMessage('Height is required')
    .isLength({ min: 1 }).withMessage('Height is too short')
    .isLength({ max: 3 }).withMessage('Height is too long'),

  check('Lenght')
    .notEmpty().withMessage('Length is required')
    .isLength({ min: 1 }).withMessage('Length is too short')
    .isLength({ max: 3 }).withMessage('Length is too long'),

  ErrorValidation // This should be outside the array
];

exports.LoginValidator = [
  check('Email')
    .notEmpty().withMessage('Email is required'),

  check('Password')
    .notEmpty().withMessage('Password is required'),

  ErrorValidation // This should be outside the array
];

exports.resetPassword = [
  check('Password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password is too short')
    .isLength({ max: 20 }).withMessage('Password is too long'),

  ErrorValidation // This should be outside the array
];
