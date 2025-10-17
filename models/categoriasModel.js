const getConexion = require("../config/mysql");

// ==============================
// 📦 MODELO DE CATEGORÍAS (MySQL)
// ==============================

const categoriasModel = {
  // Obtener todas las categorías
  async getAll() {
    const conexion = await getConexion();
    const [rows] = await conexion.query("SELECT * FROM categorias ORDER BY id_categoria DESC");
    await conexion.end();
    return rows;
  },

  // Obtener una categoría por ID
  async getById(id_categoria) {
    const conexion = await getConexion();
    const [rows] = await conexion.query("SELECT * FROM categorias WHERE id_categoria = ?", [id_categoria]);
    await conexion.end();
    return rows[0];
  },

  // Crear nueva categoría
  async create({ nombre, descripcion }) {
    const conexion = await getConexion();
    const [result] = await conexion.query(
      "INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)",
      [nombre, descripcion]
    );
    await conexion.end();
    return { id_categoria: result.insertId, nombre, descripcion };
  },

  // Actualizar categoría existente
  async update(id_categoria, { nombre, descripcion }) {
    const conexion = await getConexion();
    await conexion.query(
      "UPDATE categorias SET nombre = ?, descripcion = ? WHERE id_categoria = ?",
      [nombre, descripcion, id_categoria]
    );
    await conexion.end();
    return { id_categoria, nombre, descripcion };
  },

  // Eliminar categoría
  async remove(id_categoria) {
    const conexion = await getConexion();
    await conexion.query("DELETE FROM categorias WHERE id_categoria = ?", [id_categoria]);
    await conexion.end();
    return { success: true };
  },
};

module.exports = categoriasModel;
