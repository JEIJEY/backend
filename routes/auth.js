// Importamos express para crear el enrutador
const express = require("express");
const router = express.Router();

// Importamos las funciones del controlador
const { registerUser, loginUser } = require("../controllers/authController");

// ✅ IMPORTAR EL MIDDLEWARE DE AUTENTICACIÓN
const authMiddleware = require("../middlewares/authMiddleware");

// ✅ IMPORTAR VALIDACIONES Y MIDDLEWARE DE VALIDACIÓN (AGREGAR ESTO)
const { registerValidation, loginValidation } = require("../validations/authValidation");
const validateSchema = require("../middlewares/validateSchema");

// ============================================================
// 📘 Ruta para registrar un nuevo usuario (CON VALIDACIÓN)
// ============================================================
router.post("/register", validateSchema(registerValidation), registerUser); // ← AGREGAR validateSchema

// ============================================================
// 🔐 Ruta para iniciar sesión (CON VALIDACIÓN)
// ============================================================
router.post("/login", validateSchema(loginValidation), loginUser); // ← AGREGAR validateSchema

// ============================================================
// 🔒 RUTAS PROTEGIDAS CON JWT 
// ============================================================

// 📋 Ruta para obtener perfil del usuario (requiere token)
router.get("/perfil", authMiddleware, (req, res) => {
  res.json({
    message: "✅ Perfil accedido correctamente",
    usuario: req.user,
    datos: "Esta es información protegida del perfil"
  });
});

// 👤 Ruta para obtener datos del usuario autenticado
router.get("/usuario", authMiddleware, (req, res) => {
  res.json({
    message: "✅ Datos de usuario autorizados",
    usuario: {
      id: req.user.id,
      email: req.user.email,
      nombres: req.user.nombres
    },
    fechaAcceso: new Date().toISOString()
  });
});

// 🛡️ Ruta protegida de ejemplo
router.get("/protegido", authMiddleware, (req, res) => {
  res.json({
    message: "🎉 ¡Acceso a ruta protegida exitoso!",
    usuarioAutenticado: req.user,
    timestamp: new Date().toLocaleString()
  });
});

// Exportamos el router para que pueda ser utilizado en app.js
module.exports = router;