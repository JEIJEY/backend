// ======================================================
// 🚏 RUTAS DE PROVEEDORES (con protección JWT)
// ======================================================

const express = require("express");
const router = express.Router();

// 📦 Controlador
const proveedoresController = require("../controllers/proveedoresController");

// 🔐 Middleware de autenticación
const authMiddleware = require("../middlewares/authMiddleware");

// ======================================================
// 📜 RUTAS DISPONIBLES
// ======================================================

// ✅ Crear un nuevo proveedor (debe ir antes de las rutas con :id)
router.post("/", authMiddleware, proveedoresController.crearProveedor);

// ✅ Obtener todos los proveedores activos
router.get("/", authMiddleware, proveedoresController.obtenerProveedores);

// ✅ Obtener un proveedor específico por ID
router.get("/:id", authMiddleware, proveedoresController.obtenerProveedorPorId);

// (🧩 Próximamente) PUT y DELETE para editar o eliminar proveedores

// ======================================================
// 📤 EXPORTAR RUTAS
// ======================================================
module.exports = router;
