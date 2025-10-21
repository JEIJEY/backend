// ======================================================
// 📦 CONTROLADOR DE PROVEEDORES (MySQL real)
// ======================================================

const getConexion = require("../config/mysql");

// ======================================================
// ✅ OBTENER TODOS LOS PROVEEDORES ACTIVOS
// ======================================================
exports.obtenerProveedores = async (req, res) => {
  try {
    const conexion = await getConexion();
    const [rows] = await conexion.query(`
      SELECT 
        id_proveedor, 
        nombre, 
        contacto, 
        telefono, 
        email, 
        direccion, 
        estado
      FROM proveedores
      WHERE estado = 1
      ORDER BY nombre ASC
    `);
    await conexion.end();

    res.status(200).json(rows);
  } catch (error) {
    console.error("💥 Error al obtener proveedores:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// ======================================================
// ✅ OBTENER UN PROVEEDOR POR ID
// ======================================================
exports.obtenerProveedorPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ mensaje: "El ID de proveedor no es válido" });
    }

    const conexion = await getConexion();
    const [rows] = await conexion.query(
      `
        SELECT 
          id_proveedor, nombre, contacto, telefono, email, direccion, estado
        FROM proveedores
        WHERE id_proveedor = ?
      `,
      [id]
    );
    await conexion.end();

    if (rows.length === 0) {
      return res.status(404).json({ mensaje: "Proveedor no encontrado" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("💥 Error al obtener proveedor por ID:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// ======================================================
// ✅ CREAR UN NUEVO PROVEEDOR (USADO DESDE EL FORMULARIO)
// ======================================================
exports.crearProveedor = async (req, res) => {
  try {
    const { nombre, contacto, telefono, email, direccion } = req.body;

    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({
        mensaje: "El campo 'nombre' es obligatorio.",
      });
    }

    const conexion = await getConexion();
    const [result] = await conexion.query(
      `
        INSERT INTO proveedores (nombre, contacto, telefono, email, direccion, estado)
        VALUES (?, ?, ?, ?, ?, 1)
      `,
      [
        nombre.trim(),
        contacto?.trim() || null,
        telefono?.trim() || null,
        email?.trim() || null,
        direccion?.trim() || null,
      ]
    );
    await conexion.end();

    res.status(201).json({
      mensaje: "✅ Proveedor creado correctamente",
      data: {
        id_proveedor: result.insertId,
        nombre: nombre.trim(),
        contacto,
        telefono,
        email,
        direccion,
        estado: 1,
      },
    });
  } catch (error) {
    console.error("💥 Error al crear proveedor:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// ======================================================
// ⚙️ (LISTO PARA FUTUROS PASOS)
// updateProveedor() y eliminarProveedor() pueden añadirse después
// ======================================================
