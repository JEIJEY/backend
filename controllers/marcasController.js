// ======================================================
// 📦 MARCAS CONTROLLER - Conexión MySQL real
// ======================================================
const getConexion = require("../config/mysql");

// ✅ Obtener todas las marcas desde la BD
exports.obtenerMarcas = async (req, res) => {
  try {
    const conexion = await getConexion();
    const [rows] = await conexion.execute(
      "SELECT * FROM marcas WHERE estado = 1 ORDER BY nombre ASC"
    );
    conexion.end();
    res.status(200).json(rows);
  } catch (error) {
    console.error("💥 Error al obtener marcas:", error);
    res.status(500).json({ error: "Error al obtener las marcas" });
  }
};

// ✅ Obtener una marca específica por ID
exports.obtenerMarcaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const conexion = await getConexion();
    const [rows] = await conexion.execute(
      "SELECT * FROM marcas WHERE id_marca = ?",
      [id]
    );
    conexion.end();

    if (rows.length === 0) {
      return res.status(404).json({ message: "Marca no encontrada" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("💥 Error al obtener la marca:", error);
    res.status(500).json({ error: "Error al obtener la marca" });
  }
};

// ✅ Crear nueva marca
exports.crearMarca = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({ error: "El nombre de la marca es obligatorio" });
    }

    const conexion = await getConexion();

    // Verificar si ya existe
    const [existente] = await conexion.execute(
      "SELECT id_marca FROM marcas WHERE nombre = ? LIMIT 1",
      [nombre]
    );

    if (existente.length > 0) {
      conexion.end();
      return res.status(200).json({
        mensaje: "ℹ️ La marca ya existe",
        data: { id_marca: existente[0].id_marca, nombre },
      });
    }

    // Crear nueva marca
    const [resultado] = await conexion.execute(
      "INSERT INTO marcas (nombre, descripcion, estado) VALUES (?, ?, 1)",
      [nombre, descripcion || ""]
    );

    conexion.end();

    res.status(201).json({
      mensaje: "✅ Marca creada correctamente",
      data: {
        id_marca: resultado.insertId,
        nombre,
        descripcion,
        estado: 1,
      },
    });
  } catch (error) {
    console.error("💥 Error al crear la marca:", error);
    res.status(500).json({ error: "Error interno al crear la marca" });
  }
};
