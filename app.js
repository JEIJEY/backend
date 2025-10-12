// Importar dependencias principales
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const dbConnectMongo = require("./config/mongo");
const dbConnectMySQL = require("./config/mysql");

// Importar rutas
const authRoutes = require("./routes/auth");
const productosRoutes = require("./routes/productos");

// Configurar dotenv
dotenv.config();

// Inicializar Express
const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas principales
app.use("/api/auth", authRoutes);
app.use("/api/productos", productosRoutes);

// Conexiones a las bases de datos
dbConnectMongo();
dbConnectMySQL();

// Ruta raíz de prueba
app.get("/", (req, res) => {
  res.send("🚀 Servidor activo con MongoDB + MySQL funcionando correctamente");
});

// Levantar servidor
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`✅ Servidor corriendo en el puerto ${port}`));
