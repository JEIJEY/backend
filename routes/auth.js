// Importamos express para crear el enrutador
const express = require("express");
const router = express.Router();

// Importamos las funciones del controlador
const { registerUser, loginUser } = require("../controllers/authController");

// ✅ IMPORTAR EL MIDDLEWARE DE AUTENTICACIÓN (AGREGAR ESTA LÍNEA)
const authMiddleware = require("../middlewares/authMiddleware");

// ============================================================
// 📘 Ruta para registrar un nuevo usuario
// ============================================================
// Esta ruta se activa cuando el frontend envía los datos del formulario de registro.
// Se ejecuta la función registerUser del controlador.
router.post("/register", registerUser);

// ============================================================
// 🔐 Ruta para iniciar sesión
// ============================================================
// Esta ruta recibe el correo y contraseña del formulario de login.
// Se ejecuta la función loginUser del controlador.
router.post("/login", loginUser);

// ============================================================
// 🔒 RUTAS PROTEGIDAS CON JWT (AGREGAR ESTAS NUEVAS RUTAS)
// ============================================================

// 📋 Ruta para obtener perfil del usuario (requiere token)
router.get("/perfil", authMiddleware, (req, res) => {
  res.json({
    message: "✅ Perfil accedido correctamente",
    usuario: req.user, // ← Información del usuario del token
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