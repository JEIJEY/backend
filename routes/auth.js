// Importamos express para crear el enrutador
const express = require("express");
const router = express.Router();

// Importamos las funciones del controlador
const { registerUser, loginUser } = require("../controllers/authController");

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

// Exportamos el router para que pueda ser utilizado en app.js
module.exports = router;
