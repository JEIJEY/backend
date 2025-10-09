const jwt = require("jsonwebtoken"); // ✅ Importa librería para trabajar con JWT

// 🛡️ MIDDLEWARE de autenticación para Express
// 📝 Propósito: Verificar que el usuario esté autenticado antes de acceder a rutas protegidas
const authMiddleware = (req, res, next) => {
  try {
    // 📨 Obtener token del header Authorization
    const authHeader = req.headers.authorization;

    // 🚫 Validar que existe el header y tiene formato Bearer
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Acceso denegado. Token no proporcionado.",
      });
    }

    // ✂️ Extraer solo el token (eliminar "Bearer ")
    const token = authHeader.split(" ")[1];

    // 🔍 Verificar y decodificar el token usando la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 👤 Agregar información del usuario decodificada al request
    req.user = decoded;

    // ➡️ Pasar al siguiente middleware o controlador
    next();
  } catch (error) {
    // ❌ Manejar errores (token expirado, inválido, etc.)
    console.error("❌ Error en autenticación:", error);
    return res.status(401).json({
      message: "Token inválido o expirado.",
    });
  }
};

// 📤 Exportar middleware para usar en rutas
module.exports = authMiddleware;
