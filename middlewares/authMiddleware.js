const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("🟢 HEADER AUTORIZACIÓN:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Acceso denegado. Token no proporcionado."
      });
    }

    const token = authHeader.split(" ")[1];
    console.log("🟢 TOKEN RECIBIDO:", token);

    // 👇 Aquí verificamos con la misma clave del .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ TOKEN VERIFICADO. Usuario:", decoded.email);

    req.user = decoded;
    next();
  } catch (error) {
    console.error("❌ Error en autenticación:", error);
    res.status(401).json({ message: "Token inválido o expirado." });
  }
};

module.exports = authMiddleware;
