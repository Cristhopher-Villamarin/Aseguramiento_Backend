const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');

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

module.exports = router;