const { admin } = require('../config/firebase');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('No se proporcionó un token válido');
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken.uid;
    next();
  } catch (error) {
    res.status(401).json({ error: 'No autorizado' });
  }
};

module.exports = authMiddleware;