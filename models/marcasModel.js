// ======================================================
// 🧩 MODELO DE MARCAS (MySQL)
// ======================================================
const getConexion = require("../config/mysql");

const MarcasModel = {
  // ======================================================
  // 🟩 OBTENER TODAS LAS MARCAS ACTIVAS
  // ======================================================
  async getAll() {
    const conexion = await getConexion();
    const [rows] = await conexion.query(`
      SELECT id_marca, nombre, descripcion, estado 
      FROM marcas 
      WHERE estado = 1 
      ORDER BY nombre ASC
    `);
    await conexion.end();
    return rows;
  },

  // ======================================================
  // 🟦 OBTENER UNA MARCA POR ID
  // ======================================================
  async getById(id_marca) {
    const conexion = await getConexion();
    const [rows] = await conexion.query(
      `
      SELECT id_marca, nombre, descripcion, estado 
      FROM marcas 
      WHERE id_marca = ?
      `,
      [id_marca]
    );
    await conexion.end();
    return rows[0];
  },

  // ======================================================
  // 🟨 CREAR NUEVA MARCA
  // ======================================================
  async create({ nombre, descripcion }) {
    const conexion = await getConexion();

    // Evitar duplicados (opcional pero útil)
    const [existente] = await conexion.query(
      "SELECT id_marca FROM marcas WHERE nombre = ? LIMIT 1",
      [nombre]
    );
    if (existente.length > 0) {
      await conexion.end();
      return { existente: true, id_marca: existente[0].id_marca };
    }

    const [result] = await conexion.query(
      `
      INSERT INTO marcas (nombre, descripcion, estado)
      VALUES (?, ?, 1)
      `,
      [nombre, descripcion]
    );
    await conexion.end();
    return { id_marca: result.insertId, nombre, descripcion, estado: 1 };
  },

  // ======================================================
  // 🟧 ACTUALIZAR MARCA EXISTENTE
  // ======================================================
  async update(id_marca, { nombre, descripcion, estado }) {
    const conexion = await getConexion();
    await conexion.query(
      `
      UPDATE marcas 
      SET nombre = ?, descripcion = ?, estado = ? 
      WHERE id_marca = ?
      `,
      [nombre, descripcion, estado, id_marca]
    );
    await conexion.end();
    return { id_marca, nombre, descripcion, estado };
  },

  // ======================================================
  // 🟥 ELIMINAR MARCA (borrado lógico)
  // ======================================================
  async remove(id_marca) {
    const conexion = await getConexion();
    await conexion.query(
      "UPDATE marcas SET estado = 0 WHERE id_marca = ?",
      [id_marca]
    );
    await conexion.end();
    return { success: true };
  },
};

module.exports = MarcasModel;
