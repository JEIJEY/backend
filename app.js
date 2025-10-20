// ======================================================
// 🌐 CONFIGURACIÓN PRINCIPAL DEL SERVIDOR
// ======================================================

// Importar dependencias principales
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const dbConnectMongo = require("./config/mongo");
const dbConnectMySQL = require("./config/mysql");

// Importar rutas
const authRoutes = require("./routes/auth");
const productosRoutes = require("./routes/productos");
const categoriasRoutes = require("./routes/categorias");
const marcasRoutes = require("./routes/marcas");
const proveedoresRoutes = require("./routes/proveedores");
const abcRoutes = require("./routes/abc"); // ✅ Nueva ruta agregada

// Configurar dotenv
dotenv.config();

// Inicializar Express
const app = express();

// ======================================================
// 🔧 MIDDLEWARES GLOBALES
// ======================================================
app.use(cors());
app.use(express.json());

// ======================================================
// 🚏 RUTAS PRINCIPALES
// ======================================================
app.use("/api/auth", authRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/marcas", marcasRoutes);
app.use("/api/proveedores", proveedoresRoutes);
app.use("/api/abc", abcRoutes); // ✅ Ruta ABC añadida correctamente

// ======================================================
// 🗄️ CONEXIONES A LAS BASES DE DATOS
// ======================================================
dbConnectMongo();
dbConnectMySQL();

// ======================================================
// 🧪 RUTA RAÍZ DE PRUEBA
// ======================================================
app.get("/", (req, res) => {
  res.send("🚀 Servidor activo con MongoDB + MySQL funcionando correctamente");
});

// ======================================================
// 🚀 LEVANTAR SERVIDOR
// ======================================================
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`✅ Servidor corriendo en el puerto ${port}`);
});
