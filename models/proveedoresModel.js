// ======================================================
// 🧩 MODELO DE PROVEEDORES (MySQL)
// ======================================================

const getConexion = require("../config/mysql");

const ProveedoresModel = {
  // ======================================================
  // 🟩 OBTENER TODOS LOS PROVEEDORES ACTIVOS
  // ======================================================
  async getAll() {
    const conexion = await getConexion();
    const [rows] = await conexion.query(`
      SELECT 
        id_proveedor, 
        nombre, 
        contacto, 
        telefono, 
        correo AS email, 
        direccion, 
        estado
      FROM proveedores
      WHERE estado = 1
      ORDER BY nombre ASC
    `);
    await conexion.end();
    return rows;
  },

  // ======================================================
  // 🟦 OBTENER UN PROVEEDOR POR ID
  // ======================================================
  async getById(id_proveedor) {
    const conexion = await getConexion();
    const [rows] = await conexion.query(
      `
      SELECT 
        id_proveedor, 
        nombre, 
        contacto, 
        telefono, 
        correo AS email, 
        direccion, 
        estado
      FROM proveedores
      WHERE id_proveedor = ?
      `,
      [id_proveedor]
    );
    await conexion.end();
    return rows[0];
  },

  // ======================================================
  // 🟨 CREAR UN NUEVO PROVEEDOR
  // ======================================================
  async create({ nombre, contacto, telefono, correo, direccion }) {
    const conexion = await getConexion();
    const [result] = await conexion.query(
      `
      INSERT INTO proveedores (nombre, contacto, telefono, correo, direccion, estado)
      VALUES (?, ?, ?, ?, ?, 1)
      `,
      [nombre, contacto, telefono, correo, direccion]
    );
    await conexion.end();

    return {
      id_proveedor: result.insertId,
      nombre,
      contacto,
      telefono,
      correo,
      direccion,
      estado: 1,
    };
  },

  // ======================================================
  // 🟧 ACTUALIZAR PROVEEDOR EXISTENTE
  // ======================================================
  async update(id_proveedor, { nombre, contacto, telefono, correo, direccion, estado }) {
    const conexion = await getConexion();
    await conexion.query(
      `
      UPDATE proveedores
      SET nombre = ?, contacto = ?, telefono = ?, correo = ?, direccion = ?, estado = ?
      WHERE id_proveedor = ?
      `,
      [nombre, contacto, telefono, correo, direccion, estado, id_proveedor]
    );
    await conexion.end();

    return { id_proveedor, nombre, contacto, telefono, correo, direccion, estado };
  },

  // ======================================================
  // 🟥 ELIMINAR PROVEEDOR (Borrado lógico)
  // ======================================================
  async remove(id_proveedor) {
    const conexion = await getConexion();
    await conexion.query(
      "UPDATE proveedores SET estado = 0 WHERE id_proveedor = ?",
      [id_proveedor]
    );
    await conexion.end();
    return { success: true };
  },
};

module.exports = ProveedoresModel;
