const jwt = require('jsonwebtoken');

// Generar token JWT
const tokenSign = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role || 'user' // valor por defecto por si no existe
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Verificar token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Extraer token del header
const getTokenFromHeader = (headers) => {
  if (headers.authorization && headers.authorization.split(' ')[0] === 'Bearer') {
    return headers.authorization.split(' ')[1];
  }
  return null;
};

module.exports = { tokenSign, verifyToken, getTokenFromHeader };