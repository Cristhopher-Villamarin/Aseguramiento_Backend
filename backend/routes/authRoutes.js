const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const topicController = require('../controllers/topicController');
const reportController = require('../controllers/reportController');

const authMiddleware = require('../middleware/authMiddleware');

// Validaciones para autenticación
const validateRegister = [
  body('email').isEmail().withMessage('Correo inválido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
];

const validateLogin = [
  body('email').isEmail().withMessage('Correo inválido'),
  body('password').notEmpty().withMessage('La contraseña es requerida'),
];

// Validaciones para temas
const validateTopic = [
  body('name')
    .notEmpty().withMessage('El nombre del tema es requerido')
    .trim()
    .isLength({ min: 3, max: 50 }).withMessage('El nombre del tema debe tener entre 3 y 50 caracteres')
    .matches(/^[a-zA-Z0-9\s-_]+$/).withMessage('El nombre del tema solo puede contener letras, números, espacios, guiones y guiones bajos'),
];

// Validaciones para reportes
const validateReport = [
  body('title')
    .notEmpty().withMessage('El título del reporte es requerido')
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('El título del reporte debe tener entre 3 y 100 caracteres')
    .matches(/^[a-zA-Z0-9\s-_]+$/).withMessage('El título del reporte solo puede contener letras, números, espacios, guiones y guiones bajos'),
];

// Rutas de autenticación
router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);

// Rutas de temas (protegidas con authMiddleware)
router.post('/topics', authMiddleware, validateTopic, topicController.createTopic);
router.get('/topics', authMiddleware, topicController.getTopics);
router.put('/topics/:topicId', authMiddleware, validateTopic, topicController.updateTopic);
router.delete('/topics/:topicId', authMiddleware, topicController.deleteTopic);

// Rutas de reportes (protegidas con authMiddleware)
router.post('/topics/:topicId/reports', authMiddleware, validateReport, reportController.createReport);
router.get('/topics/:topicId/reports', authMiddleware, reportController.getReports);
router.put('/topics/:topicId/reports/:reportId', authMiddleware, validateReport, reportController.updateReport);
router.delete('/topics/:topicId/reports/:reportId', authMiddleware, reportController.deleteReport);

module.exports = router;