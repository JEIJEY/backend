const express = require("express");
const router = express.Router();

// 📥 Importar controladores de autenticación
const { registerUser, loginUser } = require("../controllers/authController");

// 🛡️ Importar middleware de autenticación JWT
const authMiddleware = require("../middlewares/authMiddleware");

// ✅ Importar esquemas de validación y middleware
const {
  registerValidation,
  loginValidation,
} = require("../validations/authValidation");
const validateSchema = require("../middlewares/validateSchema");

// ============================================================
// 📝 RUTAS PÚBLICAS (Sin autenticación requerida)
// ============================================================

// 👤 Ruta para registrar nuevo usuario con validación
router.post("/register", validateSchema(registerValidation), registerUser);

// 🔐 Ruta para iniciar sesión con validación
router.post("/login", validateSchema(loginValidation), loginUser);

// ============================================================
// 🔒 RUTAS PROTEGIDAS (Requieren token JWT válido)
// ============================================================

// 📋 Ruta para obtener perfil del usuario autenticado
router.get("/perfil", authMiddleware, (req, res) => {
  res.json({
    message: "✅ Perfil accedido correctamente",
    usuario: req.user,
    datos: "Esta es información protegida del perfil",
  });
});

// 👤 Ruta para obtener datos básicos del usuario
router.get("/usuario", authMiddleware, (req, res) => {
  res.json({
    message: "✅ Datos de usuario autorizados",
    usuario: {
      id: req.user.id,
      email: req.user.email,
      nombres: req.user.nombres,
    },
    fechaAcceso: new Date().toISOString(),
  });
});

// 🛡️ Ruta protegida de ejemplo para testing
router.get("/protegido", authMiddleware, (req, res) => {
  res.json({
    message: "🎉 ¡Acceso a ruta protegida exitoso!",
    usuarioAutenticado: req.user,
    timestamp: new Date().toLocaleString(),
  });
});

// 📤 Exportar router para uso en app.js
module.exports = router;
