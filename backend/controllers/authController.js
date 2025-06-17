const { validationResult } = require('express-validator');
const authService = require('../services/authService');

const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await authService.register(email, password);
    res.status(201).json({ message: 'Usuario registrado', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token: result.idToken,
      user: { uid: result.uid, email: result.email },
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = { register, login };