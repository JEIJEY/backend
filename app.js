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
const alertsRoutes = require("./routes/alerts"); // ✅ NUEVO: módulo de alertas

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
app.use("/api/alerts", alertsRoutes); // ✅ NUEVA RUTA DE ALERTAS (stock crítico)

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
// 🧾 DEPURAR: MOSTRAR RUTAS ACTIVAS
// ======================================================
setTimeout(() => {
  console.log("📋 RUTAS REGISTRADAS EN EXPRESS:");
  app._router?.stack?.forEach((middleware) => {
    if (middleware.route) {
      const path = middleware.route.path;
      const method = Object.keys(middleware.route.methods)[0].toUpperCase();
      console.log(`→ ${method} ${path}`);
    } else if (middleware.name === "router" && middleware.handle.stack) {
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          const subPath = handler.route.path;
          const method = Object.keys(handler.route.methods)[0].toUpperCase();
          console.log(`→ ${method} ${middleware.regexp}${subPath}`);
        }
      });
    }
  });
}, 500);

// ======================================================
// 🚀 LEVANTAR SERVIDOR
// ======================================================
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`✅ Servidor corriendo en el puerto ${port}`);
});
