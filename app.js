// Importa las dependencias necesarias para la aplicación
const express = require("express"); // Framework para crear el servidor web
const cors = require("cors"); // Permite peticiones entre diferentes dominios
const dotenv = require("dotenv"); // Maneja variables de entorno
const dbConnect = require("./config/mongo"); // Importa la función de conexión a MongoDB

// 🧭 Importa las rutas de autenticación
const authRoutes = require("./routes/auth");

// Configura dotenv para leer las variables del archivo .env
dotenv.config();

// Crea una instancia de la aplicación Express
const app = express();

// Configura los middlewares (funciones que se ejecutan antes de las rutas)
app.use(cors()); // Habilita CORS para permitir solicitudes desde otros orígenes
app.use(express.json()); // Permite procesar datos en formato JSON

// 🛣️ Usa las rutas de autenticación con un prefijo
app.use("/api/auth", authRoutes);

// Conexión a la base de datos MongoDB Atlas
dbConnect(); // Ejecuta la función que conecta con MongoDB

// Ruta de prueba para verificar que el servidor funciona
app.get("/", (req, res) => {
  res.send("Servidor Express y conexión a MongoDB funcionando correctamente 🚀");
});

// Define el puerto del servidor (usa el puerto del entorno o el 3001 por defecto)
const port = process.env.PORT || 3001;

// Levanta el servidor en el puerto definido
app.listen(port, () => {
  console.log(`✅ Servidor corriendo en el puerto ${port}`);
});
