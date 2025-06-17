const admin = require('../config/firebase');
const axios = require('axios');
require('dotenv').config();

const register = async (email, password) => {
  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });
    return { uid: userRecord.uid, email: userRecord.email };
  } catch (error) {
    throw new Error('Error al registrar: ' + error.message);
  }
};

const login = async (email, password) => {
  try {
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
      {
        email,
        password,
        returnSecureToken: true,
      }
    );

    const { idToken, localId: uid, email: userEmail } = response.data;
    return { idToken, uid, email: userEmail };
  } catch (error) {
    const errorMessage = error.response?.data?.error?.message || 'Error al iniciar sesión';
    throw new Error(`Error al iniciar sesión: ${errorMessage}`);
  }
};

module.exports = { register, login };