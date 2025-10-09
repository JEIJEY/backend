const jwt = require('jsonwebtoken'); // ✅ Importa la librería JWT para crear y verificar tokens

// 🎯 FUNCIÓN: Generar token JWT para autenticación
// 📝 Propósito: Crear un token seguro que identifique al usuario
// 🚀 Uso: tokenSign(usuario) -> retorna string del token
const tokenSign = (user) => {
  return jwt.sign(
    {
      id: user._id,        // 🔑 ID único del usuario (MongoDB)
      email: user.email,   // 📧 Email para identificar al usuario
      role: user.role || 'user' // 👨‍💼 Rol del usuario (default: 'user')
    },
    process.env.JWT_SECRET, // 🔒 Clave secreta desde variables de entorno
    { expiresIn: '24h' }    // ⏰ Token expira en 24 horas
  );
};

// 🔍 FUNCIÓN: Verificar validez del token
// 📝 Propósito: Validar si un token es válido y no ha expirado
// 🚀 Uso: verifyToken(token) -> retorna payload o null
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET); // ✅ Verifica y decodifica
  } catch (error) {
    return null; // ❌ Si hay error (token inválido/expirado) retorna null
  }
};

// 📨 FUNCIÓN: Extraer token del header de la petición
// 📝 Propósito: Obtener el token desde los headers de HTTP
// 🚀 Uso: getTokenFromHeader(headers) -> retorna token o null
const getTokenFromHeader = (headers) => {
  // 🎯 Verifica si existe authorization header con formato Bearer
  if (headers.authorization && headers.authorization.split(' ')[0] === 'Bearer') {
    return headers.authorization.split(' ')[1]; // ✂️ Extrae solo el token
  }
  return null; // ❌ No se encontró token válido
};

// 📤 EXPORTACIÓN de funciones para usar en otros archivos
module.exports = { tokenSign, verifyToken, getTokenFromHeader };