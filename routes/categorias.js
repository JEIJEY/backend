// ======================================================
// 🚏 RUTAS DE CATEGORÍAS
// ======================================================

const express = require("express");
const router = express.Router();

// Importamos el controlador
const categoriasController = require("../controllers/categoriasController");

// Si luego quieres proteger las rutas con JWT:
const { authMiddleware } = require("../middlewares/authMiddleware");

// ======================================================
// CRUD - CATEGORÍAS
// ======================================================

// ✅ Obtener todas las categorías
router.get("/", categoriasController.obtenerTodas);

// ✅ Obtener una categoría por ID
router.get("/:id", categoriasController.obtenerPorId);

// ✅ Crear una nueva categoría
router.post("/", categoriasController.crear);

// ✅ Actualizar una categoría existente
router.put("/:id", categoriasController.actualizar);

// ✅ Eliminar una categoría
router.delete("/:id", categoriasController.eliminar);

// ======================================================
// Exportar el router para usarlo en app.js
// ======================================================
module.exports = router;
