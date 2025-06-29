const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const tiktokController = require('../controllers/tiktokController');
const facebookController = require('../controllers/facebookController');

// Validaciones
const validateRegister = [
  body('email').isEmail().withMessage('Correo inválido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
];

const validateLogin = [
  body('email').isEmail().withMessage('Correo inválido'),
  body('password').notEmpty().withMessage('La contraseña es requerida'),
];

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);

router.post('/tiktok/comments', tiktokController.getTikTokComments);
router.post('/facebook/comments', facebookController.getFacebookComments);

module.exports = router;