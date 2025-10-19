const express = require("express");
const router = express.Router();

const {
  getProductos,
  postProductos,
  putProductos,
  deleteProductos,
  obtenerPorCategoria // ✅ AHORA SÍ EXISTE
} = require("../controllers/productosController");

const authMiddleware = require("../middlewares/authMiddleware");

// Rutas existentes
router.get("/", authMiddleware, getProductos);
router.post("/", authMiddleware, postProductos);
router.put("/:id", authMiddleware, putProductos);
router.delete("/:id", authMiddleware, deleteProductos);

// ✅ NUEVA RUTA - Productos por categoría (CON FUNCIÓN REAL)
router.get("/categoria/:id_categoria", authMiddleware, obtenerPorCategoria);

module.exports = router;