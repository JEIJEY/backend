// ======================================================
// 🚏 RUTAS DE CATEGORÍAS
// ======================================================

const express = require("express");
const router = express.Router();

// Importamos el controlador
const categoriasController = require("../controllers/categoriasController");

// ======================================================
// 📂 RUTAS JERÁRQUICAS (deben ir ANTES del :id)
// ======================================================

// ✅ Obtener categorías raíz
router.get("/raiz", categoriasController.obtenerCategoriasRaiz);

// ✅ Obtener jerarquía completa de categorías
router.get("/jerarquia", categoriasController.obtenerJerarquia);

// ✅ Obtener subcategorías de una categoría padre
router.get("/:id/subcategorias", categoriasController.obtenerSubcategorias);

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
// 🧩 RUTA PARA CREAR PRODUCTOS DENTRO DE UNA CATEGORÍA
// ======================================================
// Esta ruta permite agregar productos directamente en una categoría específica
router.post("/:id_categoria/productos", categoriasController.crearProductoEnCategoria);

// ======================================================
// Exportar el router
// ======================================================
module.exports = router;
