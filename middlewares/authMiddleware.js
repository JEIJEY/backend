const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: "Acceso denegado. Token no proporcionado." 
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Agregar usuario al request
    req.user = decoded;
    next();
    
  } catch (error) {
    console.error("❌ Error en autenticación:", error);
    return res.status(401).json({ 
      message: "Token inválido o expirado." 
    });
  }
};

module.exports = authMiddleware;