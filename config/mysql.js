const mysql = require("mysql2/promise");

const getConexion = async () => {
  try {
    const conexion = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });

    console.log("✅ Conectado a la base de datos MySQL:", process.env.MYSQL_DATABASE);
    return conexion;
  } catch (error) {
    console.error("❌ Error al conectar con MySQL:", error);
  }
};

module.exports = getConexion;
