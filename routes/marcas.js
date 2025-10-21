// ======================================================
// 🚏 RUTAS DE MARCAS (con protección JWT)
// ======================================================
const express = require("express");
const router = express.Router();

const marcasController = require("../controllers/marcasController");
const authMiddleware = require("../middlewares/authMiddleware");

// ======================================================
// 📋 CRUD DE MARCAS
// ======================================================

// ✅ Obtener todas las marcas activas
router.get("/", authMiddleware, marcasController.obtenerMarcas);

// ✅ Obtener una marca por su ID
router.get("/:id", authMiddleware, marcasController.obtenerMarcaPorId);

// ✅ Crear una nueva marca (permite al front agregar si no existe)
router.post("/", authMiddleware, marcasController.crearMarca);

// (Opcional para más adelante)
// router.put("/:id", authMiddleware, marcasController.actualizarMarca);
// router.delete("/:id", authMiddleware, marcasController.eliminarMarca);

module.exports = router;
