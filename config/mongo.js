// Importa la librería mongoose para conectarse con la base de datos MongoDB
const mongoose = require("mongoose");

// URL de conexión a la base de datos MongoDB Atlas
// En un entorno profesional, esta cadena se guarda en un archivo .env por seguridad
const DB_URI = "mongodb+srv://jeijeyavi_db_user:7ssevBdS8Mm42Sye@cluster0.nksszfm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Función que realiza la conexión con MongoDB utilizando estructura if / else
const dbConnect = () => {
  // Se intenta realizar la conexión con la base de datos
  mongoose.connect(DB_URI, {
    useNewUrlParser: true,      // Analiza correctamente la cadena de conexión
    useUnifiedTopology: true,   // Mejora la estabilidad de la conexión
  });

  // mongoose.connection permite acceder al estado actual de la conexión
  const connection = mongoose.connection;

  // Se ejecuta una vez cuando la conexión se establece correctamente
  connection.once("open", () => {
    console.log("✅ Conexión exitosa con la base de datos MongoDB Atlas");
  });

  // Si ocurre un error durante la conexión, se ejecuta el bloque else
  connection.on("error", (error) => {
    if (error) {
      console.error("❌ Error al conectar con la base de datos:", error);
    } else {
      console.log("✅ Conexión establecida correctamente");
    }
  });
};

// Exporta la función para que pueda ser usada en otros archivos como app.js
module.exports = dbConnect;
