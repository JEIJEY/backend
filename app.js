// ======================================================
// 🌐 CONFIGURACIÓN PRINCIPAL DEL SERVIDOR
// ======================================================

// 📦 Dependencias principales
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const dbConnectMongo = require("./config/mongo");
const dbConnectMySQL = require("./config/mysql");

// 📂 Importar rutas
const authRoutes = require("./routes/auth");
const productosRoutes = require("./routes/productos");
const categoriasRoutes = require("./routes/categorias");
const marcasRoutes = require("./routes/marcas");
const proveedoresRoutes = require("./routes/proveedores");
const abcRoutes = require("./routes/abc"); // ✅ Módulo de análisis ABC

// 📜 Configurar variables de entorno
dotenv.config();

// 🚀 Inicializar aplicación Express
const app = express();

// ======================================================
// 🔧 MIDDLEWARES GLOBALES
// ======================================================
app.use(cors()); // Permite peticiones desde el frontend
app.use(express.json()); // Permite recibir JSON en las peticiones

// ======================================================
// 🚏 RUTAS PRINCIPALES (API REST)
// ======================================================
app.use("/api/auth", authRoutes); // Autenticación (MongoDB)
app.use("/api/productos", productosRoutes); // CRUD de productos
app.use("/api/categorias", categoriasRoutes); // Categorías y subcategorías
app.use("/api/marcas", marcasRoutes); // Marcas con protección JWT
app.use("/api/proveedores", proveedoresRoutes); // Proveedores protegidos
app.use("/api/abc", abcRoutes); // Análisis ABC

// ======================================================
// 🗄️ CONEXIONES A BASES DE DATOS
// ======================================================
dbConnectMongo(); // MongoDB → Usuarios y autenticación
dbConnectMySQL(); // MySQL → Inventario, categorías, productos, etc.

// ======================================================
// 🧪 RUTA RAÍZ DE PRUEBA
// ======================================================
app.get("/", (req, res) => {
  res.send("🚀 Servidor activo con MongoDB + MySQL funcionando correctamente");
});

// ======================================================
// ⚙️ MANEJO DE ERRORES GLOBALES (Extra seguro)
// ======================================================
app.use((err, req, res, next) => {
  console.error("💥 Error global:", err);
  res.status(500).json({
    error: "Error interno del servidor",
    detalle: err.message,
  });
});

// ======================================================
// 🚀 LEVANTAR SERVIDOR
// ======================================================
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`✅ Servidor corriendo en el puerto ${port}`);
});
