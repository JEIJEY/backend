// ============================================================
// Importamos express para crear el enrutador
// ============================================================
const express = require("express");
const router = express.Router();

// ============================================================
// Importamos las funciones del controlador
// ============================================================
const { registerUser, loginUser } = require("../controllers/authController");

// ============================================================
// 🧩 Importamos validaciones con Joi y el middleware genérico
// ============================================================
const { registerValidation, loginValidation } = require("../validations/authValidation");
const validateSchema = require("../middlewares/validateSchema");

// ============================================================
// 📘 Ruta para registrar un nuevo usuario
// ============================================================
// Primero validamos los datos con Joi -> luego ejecutamos el controlador
router.post("/register", validateSchema(registerValidation), registerUser);

// ============================================================
// 🔐 Ruta para iniciar sesión
// ============================================================
// Primero validamos los datos del login -> luego ejecutamos el controlador
router.post("/login", validateSchema(loginValidation), loginUser);

// ============================================================
// Exportamos el router para que pueda ser utilizado en app.js
// ============================================================
module.exports = router;
