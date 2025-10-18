// backend/models/categoriasModel.js
const getConexion = require("../config/mysql");

const categoriasModel = {
  // Obtener todas las categorías ACTIVAS
  async getAll() {
    const conexion = await getConexion();
    const [rows] = await conexion.query(
      "SELECT * FROM categorias WHERE estado = 1 ORDER BY id_categoria DESC"
    );
    await conexion.end();
    return rows;
  },

  // Obtener una categoría por ID
  async getById(id_categoria) {
    const conexion = await getConexion();
    const [rows] = await conexion.query(
      "SELECT * FROM categorias WHERE id_categoria = ? AND estado = 1",
      [id_categoria]
    );
    await conexion.end();
    return rows[0];
  },

  // Crear nueva categoría o subcategoría
  async create({ nombre, descripcion, parent_id = null }) {
    const conexion = await getConexion();
    const [result] = await conexion.query(
      "INSERT INTO categorias (nombre, descripcion, parent_id) VALUES (?, ?, ?)",
      [nombre, descripcion, parent_id]
    );
    await conexion.end();
    return { id_categoria: result.insertId, nombre, descripcion, parent_id };
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

  // Eliminar categoría (borrado lógico)
  async remove(id_categoria) {
    const conexion = await getConexion();
    await conexion.query(
      "UPDATE categorias SET estado = 0 WHERE id_categoria = ?",
      [id_categoria]
    );
    await conexion.end();
    return { success: true };
  },

  // Obtener categorías por parent_id
  async getCategoriasByParentId(parentId = null) {
    const conexion = await getConexion();
    let query = `
      SELECT id_categoria, nombre, descripcion, parent_id, estado
      FROM categorias 
      WHERE estado = 1
    `;
    const params = [];

    if (parentId === null) {
      query += " AND parent_id IS NULL";
    } else {
      query += " AND parent_id = ?";
      params.push(parentId);
    }

    query += " ORDER BY nombre";
    const [rows] = await conexion.query(query, params);
    await conexion.end();
    return rows;
  },

  // ✅ Jerarquía completa en UNA sola consulta (MySQL 8+)
  async getJerarquiaCompleta() {
    const conexion = await getConexion();
    const [rows] = await conexion.query(`
      WITH RECURSIVE jerarquia AS (
        SELECT 
          id_categoria,
          nombre,
          descripcion,
          parent_id,
          0 AS nivel
        FROM categorias
        WHERE parent_id IS NULL AND estado = 1

        UNION ALL

        SELECT 
          c.id_categoria,
          c.nombre,
          c.descripcion,
          c.parent_id,
          j.nivel + 1
        FROM categorias c
        INNER JOIN jerarquia j ON c.parent_id = j.id_categoria
        WHERE c.estado = 1
      )
      SELECT * FROM jerarquia
      ORDER BY nivel, nombre;
    `);
    await conexion.end();
    return rows;
  },
};

module.exports = categoriasModel;
